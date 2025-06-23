# 🚲 3Pings: A Smart Bicycle Rental and Return Platform

This is a CS 145 capstone project and an entry to **"IoT Cup: Artificial Intelligence in the Internet of Things (AIoT) for Smart Cities and Sustainable Development"** under the Department of Computer Science, University of the Philippines Diliman, where it won **2nd place out of 19 participants**.

---

## 📌 Overview

**3Pings** is an IoT-powered smart bicycle-sharing platform designed to promote sustainable urban mobility. It features intelligent docking racks equipped with RFID readers and servo motor locks, a centralized backend server, and a user-centric mobile app that enables efficient and secure bike rentals and returns.

By focusing on **smart infrastructure** instead of smart bikes, 3Pings improves system scalability, cost-effectiveness, and reliability—addressing common problems in traditional bike-sharing systems such as uneven bike distribution and manual operations.

---

## 🧠 Key Features

- **RFID-enabled Smart Racks**: Each slot detects bike presence using RFID and manages locking mechanisms with servo motors.
- **Mobile/Web App**: Users can view available hubs, reserve a bike, rent and return seamlessly, and track ride history.
- **Incentive System**: Users earn credits for returning bikes to under-supplied locations, encouraging balanced distribution.
- **Centralized Backend**: Real-time synchronization of hardware status, trip history, and reward credits via a cloud-connected server.

---

## 🛠️ System Architecture

- **Hardware Layer**:
  - 🧠 **ESP32** controller handles RFID detection, servo control, and network communication.
  - 🔐 **MFRC522 RFID** reader detects bike tags per slot.
  - 🔄 **SG-90 Servo Motor** for locking/unlocking bike slots.

- **Backend Layer**:
  - Hosted on **Heroku**, with endpoints for bike rental, return, rack status, and user reward logic.
  - Syncs real-time data with Firebase.

- **Client Layer**:
  - Android-compatible app with bike hub map, trip management, and in-app wallet/reward display.

---

## 🔄 System Flow

1. **Reservation**: User selects a rack with available bikes; a bike is reserved.
2. **Rental**: User initiates rental; servo unlocks corresponding slot.
3. **Ride**: Bike is used; status changes to `Rented`.
4. **Return**: User docks bike in another rack; correct RFID is verified.
5. **Rewards**: Incentives are awarded if the return hub is in high demand.
6. **Payment**: Users can pay via linked e-wallet or use in-app credits.

---

## 📱 App Features

- View real-time hub availability and status
- Reserve bikes in advance
- Scan and rent bikes on demand
- Return bikes with verification
- Track trips and payments
- Claim rewards through "missions"

---

## ⚙️ Hardware Source Code

Core logic includes:

- `setup()` – Initializes Wi-Fi, rack ID, and hardware components.
- `loop()` – Listens for rental and return commands.
- `rent()` – Unlocks bike and verifies pickup.
- `ret()` – Verifies RFID upon return, validates correctness.
- Includes routes like `/ping`, `/rent`, and `/return`.

---

## 📦 Components and Technologies Used

- **ESP32** Microcontroller
- **RFID (MFRC522)** Module
- **Servo Motors (SG-90)**
- **React Native (App)**
- **Express.js (Server)**
- **Firebase (Database)**
- **Heroku (Server Hosting)**
- **Ngrok (for tunneling during testing)**

---

## 📚 Team
Conceptualized, designed, and built with ❤️ by CS 145 AY 2024-2025 students:
- Hardware
  - Pamella Jei Dela Rosa  
  - Katrina Ann Mislang  
  - Gian Mark Santos

- Software
  - Bea Alessi Yukdawan  
  - Julia Ysobel Pineda  
  - Arturo Miguel Saquilayan  

---

## 📄 License

This project is for educational and research purposes only. All rights reserved.

---

## 🤝 Acknowledgments

Special thanks to the **CS 145** faculty and organizers of the **IoT Cup 2025**, as well as the Prof. Wilson M. Tan for their guidance and support throughout the development of this project.
