# Souper Card Game (SCG) 2016

This is a website based off of FIFA's Ultimate Team (FUT) where your goal is to build the best draft possible from a virtual card deck of players from the mouse game [Transformice](https://www.transformice.com/) (TFM).

A new 2020 version is on the works, titled [Transformice Ultimate Team](https://github.com/andyAndyA/Transformice-Ultimate-Team) (TUT).

## Play Now

This game is deployed on the following link, ready for play; [wwong-andy.github.io/Souper-Card-Game-2016/](https://wwong-andy.github.io/Souper-Card-Game-2016/).

It can also be ran locally by following the instructions below;

*Note that these steps assume knowledge of the command line, and that git and npm should be installed.*

#### 1. git clone

The following commands executed in the terminal clones the project repository locally and moves into the new directory;
```
git clone https://github.com/andyAndyA/Souper-Card-Game-2016.git

cd Souper-Card-Game-2016
```

#### 2. download "harp"

I have been using the "harp" npm service to quickly instantiate web servers locally for testing the game, it can be installed via;

`sudo npm install -g harp`

#### 3. harp server

Once installed, the web server can be instantiated using the following command below, and then the game is deployed locally at localhost:9000

`harp server`
