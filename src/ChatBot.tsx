import React, { useState } from 'react';
import { View, TextInput, Button, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

// Directly include the API key (not recommended)
const apiKey = process.env.OPENAI_API_KEY;

// Define the type for messages
type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const ChatBot = () => {
  // Use the Message type for state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const maxRetries = 3;
    let attempt = 0;
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    while (attempt < maxRetries) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [...messages, userMessage],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );

        console.log('API Response:', response.data); // Log the API response
        const botMessage: Message = { role: 'assistant', content: response.data.choices[0].message.content };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        break; // Exit loop if successful
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('API Error Response:', error.response?.data); // Log detailed API error response

          if (error.response?.status === 429) {
            attempt += 1;
            const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
            console.log(`Rate limit exceeded. Retrying in ${waitTime / 1000} seconds...`);
            await delay(waitTime);
          } else {
            console.error('Error fetching response from OpenAI:', error.response?.data || error.message);
            break; // Exit loop for other errors
          }
        } else {
          console.error('Unexpected error:', error);
          break; // Exit loop for unexpected errors
        }
      }
    }

    setInput('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Text style={item.role === 'user' ? styles.userText : styles.botText}>{item.content}</Text>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Type your message..."
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f0f0f0' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginVertical: 10 },
  userText: { alignSelf: 'flex-end', padding: 10, backgroundColor: '#d1fcd3', borderRadius: 10, marginVertical: 2 },
  botText: { alignSelf: 'flex-start', padding: 10, backgroundColor: '#e8e8e8', borderRadius: 10, marginVertical: 2 },
});

export default ChatBot;
