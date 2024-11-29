#!/bin/bash

# Vérifier si les fichiers de certificat et de clé existent déjà
if [ ! -f cert.pem ] || [ ! -f key.pem ]; then
    echo "Génération du certificat SSL auto-signé..."
    openssl genpkey -algorithm RSA -out key.pem
    openssl req -new -key key.pem -out csr.pem -config openssl.cnf
    openssl x509 -req -in csr.pem -signkey key.pem -out cert.pem
else
    echo "Certificat SSL déjà présent. Démarrage du serveur."
fi

# Vérification de la correspondance entre la clé et le certificat
openssl rsa -noout -modulus -in key.pem | openssl md5
openssl x509 -noout -modulus -in cert.pem | openssl md5

# Démarrer le serveur Django en HTTPS
python3 manage.py runserver_plus --cert-file cert.pem --key-file key.pem
