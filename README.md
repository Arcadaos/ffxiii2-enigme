# Lancement API Flask
## Activer environnement Python
### Windows version (cmd)
```cmd
cd API
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```
### Linux version
```bash
cd API
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
## Démarrer l'API
```bash
python horloge.py
```
Démarré sur le port 5000

# Lancement de l'interface web
```cmd
cd webapp/
npm install
npm run dev
```
