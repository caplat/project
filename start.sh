#!/bin/bash

# Vérifier si les fichiers de certificat et de clé existent déjà
if [ ! -f cert.pem ] || [ ! -f key.pem ]; then
    echo "Génération du certificat SSL auto-signé..."
    openssl genpkey -algorithm RSA -out key.pem
    openssl req -new -key key.pem -out csr.pem -config /app/openssl.cnf
    openssl x509 -req -in csr.pem -signkey key.pem -out cert.pem
else
    echo "Certificat SSL déjà présent. Démarrage du serveur."
fi

# Vérification de la correspondance entre la clé et le certificat
openssl rsa -noout -modulus -in key.pem | openssl md5
openssl x509 -noout -modulus -in cert.pem | openssl md5

# Vérifier la connexion à la base de données (en utilisant la commande `pg_isready`)
echo "Vérification de la disponibilité de la base de données..."
until pg_isready -h db -p 5432; do
    echo "Attente de la base de données..."
    sleep 2
done

# Exécution des migrations
echo "Exécution des migrations..."
python manage.py migrate

#Creation du superutilisateur
python manage.py createsuperuser --noinput || true

# Démarrer le serveur Django en HTTPS
echo "Démarrage du serveur Django..."
python manage.py runserver_plus --cert-file cert.pem --key-file key.pem 0.0.0.0:8000

