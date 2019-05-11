GoogleDriveAPI

L'applicazione permette di caricare un unico file sul drive, permettendo di sceglierlo dal proprio pc

L'applicazione è contenuta dentro la directory 'Applicazione'. Gli altri file presenti nella directory sono dei test.

Funzionamento:
1. Lanciare il server sulla porta corretta (localhost:8000)
2. Autenticarsi e loggarsi premendo l'opportuno bottone
3. Selezionare dal menu a tendina il file (uno solo!) da caricare sul drive
4. Premere 'upload' per caricare il file
5. Attendere il completamento

NOTA: ci sono due file .js: 
1 - Util.js contiene il file js inerente il caricamento di uno o più file su drive, tramite $.ajax;
2 - Il file Util1.js contiene il caricamento di un file all'interno di una cartella su drive (la cartella sul drive può anche non esistere. Se esiste è necessario specificare l'Id della cartella per destinare il file a quella specifica cartella), tramite l'utilizzo delle API fornite da Google
