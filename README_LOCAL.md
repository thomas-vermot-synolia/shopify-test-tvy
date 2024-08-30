
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
