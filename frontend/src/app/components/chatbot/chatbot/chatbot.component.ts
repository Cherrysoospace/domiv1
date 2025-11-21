import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatbotService } from '../chatbot.service';

interface Message {
  from: 'user' | 'bot';
  text: string;
  time: number;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  open = false;
  input = '';
  loading = false;
  useTTS = false; // optional voice

  messages: Message[] = [];

  // Simple FAQ list: patterns (lowercase substrings) and responses
  faqs = [
    { q: '¿para qué sirve este sistema', patterns: ['para qué sirve', 'que hace', 'qué hace'], a: 'Este sistema gestiona pedidos y entregas para restaurantes y conductores.' },
    { q: '¿dónde registro un conductor', patterns: ['registrar un conductor', 'registro conductor', 'registrar conductor'], a: 'Puedes registrar un conductor en la sección de "Conductores" del menú, o en la página de registro si eres administrador.' },
    { q: '¿en qué parte hago un pedido', patterns: ['hacer un pedido', 'donde hago un pedido', 'como hago un pedido'], a: 'Para crear un pedido ve a la sección "Pedidos" y haz clic en "Nuevo pedido"; allí podrás seleccionar productos y confirmar.' }
  ];

  constructor(private chatbot: ChatbotService) { }

  ngOnInit(): void {
    // Welcome message
    this.pushBot('¡Hola! Soy el asistente virtual. Escribe tu pregunta o elige una FAQ.');
  }

  toggle() {
    this.open = !this.open;
    // small animation delay to scroll
    setTimeout(() => this.scrollToBottom(), 200);
  }

  pushBot(text: string) {
    this.messages.push({ from: 'bot', text, time: Date.now() });
    this.scrollToBottomWithDelay();
    if (this.useTTS) this.speak(text);
  }

  pushUser(text: string) {
    this.messages.push({ from: 'user', text, time: Date.now() });
    this.scrollToBottomWithDelay();
  }

  send() {
    const text = (this.input || '').trim();
    if (!text) return;
    this.pushUser(text);
    this.input = '';

    // FAQ check
    const faq = this.findFaq(text);
    if (faq) {
      // immediate response without calling API
      setTimeout(() => this.pushBot(faq.a), 300);
      return;
    }

    // call Gemini via service
    this.loading = true;
    this.chatbot.sendMessage(text).subscribe(resp => {
      this.loading = false;
      const reply = resp || 'Lo siento, no tengo una respuesta en este momento.';
      this.pushBot(reply);
    }, err => {
      this.loading = false;
      this.pushBot('Lo siento, ocurrió un error al conectarme al servicio.');
    });
  }

  findFaq(text: string) {
    const t = text.toLowerCase();
    return this.faqs.find(f => f.patterns.some((p: string) => t.includes(p)));
  }

  chooseFaq(faq: any) {
    this.pushUser(faq.q);
    setTimeout(() => this.pushBot(faq.a), 250);
  }

  scrollToBottomWithDelay() {
    setTimeout(() => this.scrollToBottom(), 100);
  }

  scrollToBottom() {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    } catch (e) { }
  }

  // optional TTS using Web Speech API
  speak(text: string) {
    try {
      const synth = (window as any).speechSynthesis;
      if (!synth) return;
      const utter = new SpeechSynthesisUtterance(text);
      synth.cancel();
      synth.speak(utter);
    } catch (e) {
      console.warn('TTS not available', e);
    }
  }

}
