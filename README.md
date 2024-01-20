
# Webshop Dierenspeeltjes.nl

Dit is het Webshop Project voor e-commerce online winkel.

Functionaliteiten

Productoverzicht: Gebruikers kunnen alle beschikbare producten bekijken.
Winkelwagen: Gebruikers kunnen producten toevoegen aan hun winkelwagen en de inhoud ervan bekijken.
Bestelproces: Gebruikers kunnen een bestelling plaatsen. Betalingen en persoonlijke gegevens worden niet verwerkt, maar er wordt wel een bevestiging van de bestelling getoond.
Admin Paneel: Beheerders kunnen bestellingen bekijken, producten toevoegen, wijzigen of verwijderen, en de producten resetten naar de oorspronkelijke staat.

## Inhoudsopgave

- Technologieën
- Projectstructuur
- Installatie
- Gebruik
- Licentie

## Technologieën

Dit project maakt gebruik van de volgende technologieën:

- HTML en CSS voor de front-end
- JavaScript voor interactieve functionaliteit
- Node.js en Express.js voor de back-end
- JSON voor gegevensopslag
- Fetch API voor communicatie met de server

## Projectstructuur

De projectstructuur ziet er als volgt uit:

- webshop/
  - css/
    - styles.css
  - html/
    - index.html
    - admin.html
    - cart.html
    - orders.html
  - js/
    - admin.js
    - cart.js
    - orders.js
    - Products.js
    - script.js
    - server.js
  - data/
    - products.json
    - orders.json
  - README.md
  - foto/
  - icon/
  - package.json
  - package-lock.json

- De `css/` map bevat de opmaakbestanden.
- De `html/` map bevat HTML-bestanden voor de hoofdpagina, beheerderspagina, winkelwagenpagina en bestellingenpagina.
- De `js/` map bevat JavaScript-bestanden voor de front-end en de server, inclusief de ontbrekende bestanden zoals cart.js, Products.js en script.js.
- De `data/` map bevat JSON-bestanden voor producten en bestellingen.
- `README.md`

## Installatie en Gebruik

Om het project lokaal op te zetten, volg deze stappen:

1. Kloon de repository naar je lokale machine.
2. Open de terminal en navigeer naar de projectmap.
3. Voer `npm install` uit om alle nodige packages te installeren.
4. Start de server met `npm start`.

De webshop zal beschikbaar zijn op `http://localhost:3000`.

## Inloggen

Om toegang te krijgen tot de beheerderspagina, gebruik het standaardwachtwoord `0000`.

Het project is online beschikbaar op: <https://dancing-sopapillas-56809a.netlify.app>

Auteur:
Adam Wejman
