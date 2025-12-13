import * as signalR from '@microsoft/signalr';
import { store } from '../store/strore';
import { addQuestion, addAnswer } from '../reducers/questionSlice';
import axios from 'axios';

class SignalRService {
  connection: signalR.HubConnection | null = null;

  async connect() {
    try {
      if (!this.connection) {
        this.connection = new signalR.HubConnectionBuilder()
          .withUrl("https://localhost:7000/questionHub")
          .withAutomaticReconnect()
          .build();
      }

      if (this.connection.state === signalR.HubConnectionState.Disconnected) {
        await this.connection.start();
        console.log("Connected to SignalR Hub");

        await this.connection.invoke("JoinAdmin");

        this.connection.on("ReceiveQuestion", (data) => {
          console.log("New question received:", data);
          store.dispatch(addQuestion(data));
        });

        this.connection.on("ReceiveAnswer", (data) => {
          console.log("Answer received:", data);
          store.dispatch(addAnswer(data));
        });
      }
    } catch (error) {
      console.error("Error connecting to Hub:", error);
    }
  }

  async sendAnswer(questionId: string, userId: string, answer: string) {
    if (!this.connection) return;
    await this.connection.invoke('SendAnswer', questionId, userId, answer);
  }

  async fetchAllQuestions() {
    try {
      const res = await axios.get('https://localhost:7000/api/v1/Questions/GetAllQuestions');
      return res.data; 
    } catch (error) {
      console.error("Error fetching questions:", error);
      return [];
    }
  }
}

export default new SignalRService();
