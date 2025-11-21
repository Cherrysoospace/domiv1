import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from '../../components/chatbot/chatbot/chatbot.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ChatbotComponent],
  imports: [CommonModule, FormsModule, HttpClientModule],
  exports: [ChatbotComponent]
})
export class ChatbotModule { }
