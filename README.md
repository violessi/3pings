# 🚲 3Pings: A Smart Bicycle Rental and Return Platform

This is a CS 145 capstone project and an entry to the **IoT Cup: Artificial Intelligence in the Internet of Things (AIoT) for Smart Cities and Sustainable Development** at the Department of Computer Science, University of the Philippines Diliman, where it won **2nd place** out of 19 participants.

## 🚀 Overview

**3Pings** is a smart, sustainable bicycle-sharing system designed to support urban mobility and smart city development. Unlike traditional systems that modify the bicycles, 3Pings focuses on **RFID-powered docking racks**, enabling easier maintenance, real-time monitoring, and more scalable deployments.

The system improves bicycle distribution, user engagement, and maintenance workflows by combining:
- Smart docking racks with RFID readers
- Real-time usage and hub data
- Automated locking/unlocking of bikes
- A web/mobile app for users to locate, reserve, and return bikes

## 🌟 Key Features

- **RFID Verification:** Both bikes and racks use RFID for secure, contactless identification.
- **Smart Docking Hubs:** Track bike status (Available, In Use, Reserved) and trigger LED indicators and electromagnetic locks.
- **Dynamic Incentive System:** Users receive rewards for returning bikes to low-availability hubs.
- **User App Interface:**
  - Locate nearby hubs
  - Reserve bikes
  - View real-time availability and rewards
  - Track ride history and return status

## 🧠 System Components

### Hardware
- ESP8266 Wi-Fi Microcontroller
- RFID Readers (Rack + Bike)
- Electromagnetic Locks
- LED Indicators
- Power Supply
- Breadboards and wiring
- Bicycle and custom-built rack

### Software
- Backend server using **Express.js** to process RFID scans and manage state
- Web/mobile frontend built in **React Native (Expo)** for user interaction
- **Firebase** Real-time database for:
  - Hub status and bike location
  - User accounts and reservation logs
  - Reward logic and late return notifications

## 🫱🏻‍🫲🏻 Contributors
Conceptualized, designed, and built with ❤️ by CS 145 Students in UP Diliman:
- Hardware:
    - Pamella Jei Dela Rosa
    - Katrina Ann Mislang
    - Gian Mark Santos
    
- Software:
    - Bea Alessi Yukdawan
    - Julia Ysobel Pineda
    - Arturo Miguel Saquilayan
