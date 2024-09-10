
```
nvm use 20
shopify theme dev
```

# Thème test SHOPIFY

## Installation CLI pour developpement

```
# Use node v20.10
nvm use 20

# Install CLI package
npm install -g @shopify/cli@latest

# Install Ruby
sudo apt update && sudo apt upgrade
sudo apt install curl gcc g++ make
sudo apt install ruby-full
sudo apt install ruby-dev
# Ruby development environment
sudo apt install git

# Test is shopify CLI is installed
shopify help

# Install Bundler (sinon, j'arrivais pas à lancer)
gem install bundler

# Bravo
```

### Lancer le local la première fois

```
shopify theme dev --store {YOUR STORE CODE}
```
La première fois, il faut définir le store qu'on va utiliser
ça demandera de se loguer au BO sur le navigateur.
Puis y aura plus qu'à aller sur http://127.0.0.1:9292

### Lancer les autres fois

```
nvm use 20
shopify theme dev
```
Puis y aura plus qu'à aller sur http://127.0.0.1:9292

## Synchronisation thème 

NOTE IMPORTANTE: J'ai installé l'app *Globo Mega Menu* (https://apps.shopify.com/globo-mega-menu?locale=fr&search_id=49450562-6b6d-4098-8a09-3e3bf787fef8&surface_detail=mega+menu&surface_inter_position=1&surface_intra_position=7&surface_type=search)
et ça a mis à jour le code versionné sur github. Donc mon local a perdu la synchro.
J'ai pu _rebaser_ et me débrouiller. Mais c'est un soucis à garder en tête sur un vrai projet

## metaobjects

### metaobjects du theme:

Exemple avec un metaobject "size_guide" qui aurait un champ texte "intro":

```
<p>Les intros de metaobjets size_guide sont:</p>
{%- for guide in shop.metaobjects.size_guide.values -%}
    <p>
        URL: {{ guide.system.url }}<br/>
        INTRO: {{ guide.intro }}
    </p>
{% endfor %}
```

### metaobject lié à un produit (dans la fiche produit) (sous le label "linked_size_guide"):

```
{{ product.metafields.custom.linked_size_guide.value.intro }}
```
