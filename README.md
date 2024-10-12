# SmartQuiz

Questo progetto è composto da due principali sezioni: il front-end e il back-end. Di seguito troverai le istruzioni dettagliate per eseguire entrambe le parti.

## Indice
1. [Introduzione](#introduzione)
2. [Requisiti](#requisiti)
3. [Configurazione del Back-End](#configurazione-del-back-end)
4. [Configurazione del Front-End](#configurazione-del-front-end)
5. [Esecuzione](#esecuzione)
6. [Problemi Comuni](#problemi-comuni)
7. [Contatti](#contatti)

## Introduzione

Questo progetto è un'applicazione che utilizza un'architettura moderna con un front-end realizzato in Angular e un back-end sviluppato con Express e Sequelize, utilizzando PostgreSQL come database.

## Requisiti

### Back-End
- Node.js (runtime)
- Express (framework)
- Sequelize (ORM) 

### Front-End 
- Angular CLI (framework)
- Tailwind CSS (CSS framework)
   

## Configurazione del Back-End

1. **Clona il repository:**
   
   ```bash
   git clone https://github.com/tosska/smartquiz.git

3. **Naviga nella cartella del back-end:**
   
   ```bash
    cd smartquiz/backend
   
5. **Installa le dipendenze:**
   
   ```bash
    npm install
   
7. **Configura il database:**
- Crea un database PostgreSQL e annota le credenziali di accesso.
- Modifica il file di configurazione del database (config/config.json) con le tue credenziali.

5. **Avvia il server:**
   
    ```bash
    npm start

Il server sarà in esecuzione su **http://localhost:3000**

## Configurazione del Front-End

1. Naviga nella cartella del front-end:
   
   ```bash
   cd ../frontend
   
3. Installa le dipendenze:
   
   ```bash
    npm install
   
5. Avvia l'applicazione Angular:
   
   ```bash
   ng serve
   
L'applicazione sarà accessibile su **http://localhost:4200**

## Esecuzione

Assicurati che il server del back-end sia in esecuzione prima di avviare il front-end. Una volta avviati entrambi i servizi, puoi interagire con l'applicazione web dal tuo browser.

## Problemi Comuni

- **Errore di connessione al database**: Verifica che le credenziali nel file di configurazione siano corrette e che il server PostgreSQL sia in esecuzione.
- **Problemi con le dipendenze**: Assicurati di avere installato tutte le dipendenze necessarie eseguendo **npm install**.

## Contatti

Per ulteriori informazioni, domande o problemi:
- Email: l.trignano@studenti.unina.it
- GitHub: tosska







