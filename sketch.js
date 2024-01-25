/*

Relatório Projeto Final

Resumo
- Fiz um jogo estilo space shooter que se utiliza de
  conceitos apresentados nas aulas.

Créditos
• Sprites:
- A maioria dos sprites foram feitos por mim,
  alguns baseados em imagens da internet.

• Música
- Mega Man 3 - Spark Man Stage

• Efeitos Sonoros
- Star Force  (NES)
- Sonic 1 e 3 (MEGA DRIVE)

*/





/*------------------*/
/*    Variáveis    */
/*----------------*/

// Estados do Jogo
let isGamePaused = false;        // Jogo pausado
let isGameOver = false;         // Game Over
let isDebugMode = false;       // Debug Mode
let isGodMode = false;        // God Mode (Invencível)
let isTimePaused = false;    // Tempo parado

// Nave
let player;                // Nave na tela
let playerHP = 5;         // HP da Nave
let shoots = [];         // Tiros na tela
let canShoot = true;    // Dalay de tiro
let score = 0;         // Pontuação

// Ataque de laser
let isLaserActive = false;     // Laser ativado
let laserActivatedTime = 0;   // Tempo que o laser está ativo
let laserDuration = 1400;    // Duração do laser (1,4 segundos)
let laserCooldown = 15000;  // Cooldown do laser (8 segundos)
let cooldownLimit = 150;   // Limite do Cooldown (Variável para a barra de ataque)

// Variáveis dos inimigos
let enemies = [];                   // Inimigos na tela
let enemySpeed = 0;                // Velocidade
let EnemyShoots = [];             // Tiros na tela
let enemyShootInterval = 3000;   // Delay dos tiros
let lastEnemyShootTime = 0;     // Último momento em que o inimigo atirou
let defeatedEnemies = 0;       // Contador de inimigos

// Asteroides
let asteroids = [];

// Boss
let boss;                    // Boss
let bossSpawned = false;    // Boss está na tela
let scoreSpawn = 400;      // A cada quantos pontos ele vai aparecer

// Outros
let explosions = [];               // Explosões na tela
let sprite1 = true;               // Troca de sprite
let startTime;                   // Iniciar timer
let elapsedTime;                // Tempo decorrido
let bgY = 0;                   // Posição inicial do fundo
let bgY2 = 0;                 // Posição inicial do fundo 2

// Tutorial
let showTutorialScreen = true;    // Mostrar tela de tutorial
let tutorialPageIndex = 0;       // Índice da página do tutorial
let tutorialPages = [
  "Bem-vindo(a) ao tutorial!",
  "Controles:\n Mouse: Mover a nave\n Click Esquerdo: Atirar\nClick Direito: Ataque de laser\nBackspace: Pausar",
  "Objetivos:\n Não deixe os inimigos passarem\n Não colida em inimigos ou asteroides\n Sobreviva o máximo possível"
];





/*--------------------------------*/
/*    Carregar Assets do Jogo    */
/*------------------------------*/
function preload() {
  /* Formatos de Som */
  soundFormats("mp3", "wav");


  /* ---- Tela ---- */
  img_scores = loadImage("sprites/ui/scores.png");  // HUD dos pontos
  img_logo = loadImage("sprites/ui/logo.png");     // Logo do jogo
  font_arcade = loadFont("Retro Gaming.ttf");     // Fonte do jogo
  
  // Fundo da fase
  img_bg_1 = loadImage("sprites/background/1.png");
  img_bg_2 = loadImage("sprites/background/2.png");
  
  /* Barras */
  // Vida
  img_bar_hp_1 = loadImage("sprites/ui/bar/hp/1.png");
  img_bar_hp_2 = loadImage("sprites/ui/bar/hp/2.png");
  img_bar_hp_3 = loadImage("sprites/ui/bar/hp/3.png");
  img_bar_hp_4 = loadImage("sprites/ui/bar/hp/4.png");
  img_bar_hp_5 = loadImage("sprites/ui/bar/hp/5.png");

  // Ataque Especial
  img_bar_sa_1 = loadImage("sprites/ui/bar/sa/1.png");
  img_bar_sa_2 = loadImage("sprites/ui/bar/sa/2.png");
  img_bar_sa_3 = loadImage("sprites/ui/bar/sa/3.png");
  img_bar_sa_4 = loadImage("sprites/ui/bar/sa/4.png");
  img_bar_sa_5 = loadImage("sprites/ui/bar/sa/5.png");

  // Base
  img_bar_base = loadImage("sprites/ui/bar/base.png");




  /* ---- Elementos do jogo ---- */

  // Jogador
  img_player_1 = loadImage("sprites/player/player1.png");
  img_player_2 = loadImage("sprites/player/player2.png");
  img_player_shoot = loadImage("sprites/player/player_shoot.png");
  snd_player_shoot = loadSound("sounds/shoot.wav");

  // Laser
  img_laser = loadImage("sprites/player/player_laser.png");
  snd_laser = loadSound("sounds/laser.wav");

  // Nave Inimiga
  img_enemy_1 = loadImage("sprites/enemy/enemy1.png");
  img_enemy_2 = loadImage("sprites/enemy/enemy2.png");
  img_enemy_shoot = loadImage("sprites/enemy/enemy_shoot.png");
  snd_enemy_shoot = loadSound("sounds/en-shoot.wav");

  // Asteroide
  img_ast_1 = loadImage("sprites/asteroids/ast1.png");
  img_ast_2 = loadImage("sprites/asteroids/ast2.png");
  img_ast_3 = loadImage("sprites/asteroids/ast3.png");

  // Explosão
  img_explo = loadImage("sprites/explo.png");

  // Boss
  img_boss_1 = loadImage("sprites/boss/boss1.png");
  img_boss_2 = loadImage("sprites/boss/boss2.png");
  img_boss_explo = loadImage("sprites/boss/boss-explo.png");
  img_boss_shoot = loadImage("sprites/boss/boss_shoot.png");



  /* ---- Sons Gerais ---- */
  snd_explo = loadSound("sounds/explo.wav");         // Explosão
  snd_alarm = loadSound("sounds/alarm.wav");        // Alarme
  snd_dmg = loadSound("sounds/dmg.wav");           // Dano
  snd_music = loadSound("sounds/main-theme.mp3"); // Música Principal
}





/*-----------------*/
/*    Tutorial    */
/*---------------*/
function showTutorial() {
  canShoot = false;
  
  // Fundo
  image(img_bg_1, 0, bgY);
  fill(0, 0, 0, 120);
  rect(0, 0, width, height);
  
  // Logo
  image(img_logo, 35, 60, 447, 240);

  // Organizar o texto
  fill(255);
  textAlign(CENTER, CENTER);
  textFont(font_arcade);
  strokeWeight(4);
  stroke("black");

  // Verificar o índice da página atual
  if (tutorialPageIndex < tutorialPages.length) {
    // Texto da página atual
    textSize(20);
    text(tutorialPages[tutorialPageIndex], width / 2, height / 2 + 30);
    // Contagem de página
    text(
      "Página " + (tutorialPageIndex + 1) + "/" + tutorialPages.length,
      width / 2,
      height - 50
    );
  } else {
    // Mensagem do fim do tutorial
    text("Tutorial concluído!\nBoa Sorte!", width / 2, height / 2);
  }

  // Exibir "Próxima Página" se tiver páginas restantes
  if (tutorialPageIndex < tutorialPages.length - 1) {
    text("Clique para avançar", width / 2, height - 100);
  } else {
    // Exibir "Iniciar jogo" se não tiver páginas restantes
    text("Iniciar Jogo", width / 2, height - 100);
  }
}

// Avançar para a próxima página
function nextTutorialPage() {
  if (tutorialPageIndex < tutorialPages.length) {
    tutorialPageIndex++;
  } else {
    // Se o tutorial for concluído
    showTutorialScreen = false;
    canShoot = true;
    resetGame();
  }
}

// Verificar clique para avançar o tutorial
function mouseClicked() {
  if (showTutorialScreen) {
    nextTutorialPage();
  }
}





/*----------------------*/
/*    Inicialização    */
/*--------------------*/
function setup() {
  createCanvas(500, 700);         // Criar o Canvas
  snd_music.setVolume(1.8);      // Regular o volume da música
  snd_music.loop();             // Tocar música principal em loop
  player = new Player();       // Colocar a nave
  boss = new Boss();          // Colocar boss
  startTime = millis();      // Iniciar o contador do tempo
}





/*-------------*/
/*    Jogo    */
/*-----------*/
function draw() {
  if (showTutorialScreen) {
    showTutorial();  // Abrir tutorial
    return;         // Evitar que o resto do jogo seja excutado
  }

  /* Desenhar o fundo em looping */

  // Fundo
  image(img_bg_1, 0, bgY);
  image(img_bg_1, 0, bgY - height);
  // Planeta
  image(img_bg_2, 0, bgY2);
  image(img_bg_2, 0, bgY2 - height);

  // Mover o y do fundo 1
  bgY += enemySpeed / 2;
  // Reiniciar o y do fundo 1 quando chegar no final
  if (bgY >= height) {
    bgY = 0;
  }

  // Mover o y do fundo 2
  bgY2 += enemySpeed * 1.5;
  // Reiniciar o y do fundo 2 quando chegar no final
  if (bgY2 >= height) {
    bgY2 = 0;
  }

  // Movendo e mostrando os tiros do inimigo
  for (let i = EnemyShoots.length - 1; i >= 0; i--) {
    EnemyShoots[i].move();
    EnemyShoots[i].render();

    // Remover os tiros do inimigo que saem da tela
    if (EnemyShoots[i].offscreen()) {
      EnemyShoots.splice(i, 1);
    }
  }

  // Verificar colisão com os tiros do inimigo
  for (let i = EnemyShoots.length - 1; i >= 0; i--) {
    if (EnemyShoots[i].hits(player) && !isGodMode) {
      EnemyShoots.splice(i, 1);
      player.dmg("shot");
    }
  }

  if (score % scoreSpawn === 0 && score > 0 && !bossSpawned) {
    boss.spawn();
    bossSpawned = true;

    snd_alarm.setVolume(0.4);
    snd_alarm.loop();
  }

  if (bossSpawned) {
    boss.move();
    boss.render();

    if (boss.offscreen() && !isGodMode) {
      gameOver("enemy");
      return;
    }

    if (boss.hits(player) && !isGodMode) {
      image(img_explo, player.x - 30, player.y - 30, 80, 80);
      gameOver("collision");
      return;
    }

    for (let i = shoots.length - 1; i >= 0; i--) {
      if (shoots[i].hit(boss)) {
        shoots.splice(i, 1);
        boss.dmg();
      }
    }

    if (millis() - boss.lastShootTime >= 2000 && boss.canShoot) {
      boss.shoot();
    }
  }

  if (isLaserActive) {
    noStroke();
    image(img_laser, player.x - 32, player.y - 1000, 63, 1000);
    //fill(255, 0, 0, 100);
    //rect(player.x - 50, player.y, 100, -10000);

    // Verificar colisão com inimigos
    for (let i = enemies.length - 1; i >= 0; i--) {
      if (
        // Esquerda
        enemies[i].x >= player.x - 50 &&
        // Direita
        enemies[i].x <= player.x + 50 &&
        // Frente
        enemies[i].y >= player.y - 10000 &&
        // Atrás
        enemies[i].y <= player.y + 10
      ) {
        // Inimigo entra na área do img_laser e é destruído
        explosions.push(new Explosion(enemies[i].x, enemies[i].y, 60));
        score += 10;
        defeatedEnemies += 1;
        enemies.splice(i, 1);
      }
    }

    // Verificar colisão com asteroides
    for (let i = asteroids.length - 1; i >= 0; i--) {
      if (
        asteroids[i].x >= player.x - 50 &&
        asteroids[i].x <= player.x + 50 &&
        asteroids[i].y >= player.y - 10000 &&
        // Atrás
        asteroids[i].y <= player.y + 10
      ) {
        // Asteroide entra na área do img_laser e é destruído
        explosions.push(new Explosion(asteroids[i].x, asteroids[i].y, 60));
        score += 10;
        asteroids.splice(i, 1);
      }
    }

    // Verificar colisão com asteroides
    for (let i = EnemyShoots.length - 1; i >= 0; i--) {
      if (
        EnemyShoots[i].x >= player.x - 50 &&
        EnemyShoots[i].x <= player.x + 50 &&
        EnemyShoots[i].y >= player.y - 10000 &&
        // Atrás
        EnemyShoots[i].y <= player.y + 10
      ) {
        EnemyShoots.splice(i, 1);
      }
    }

    if (
      boss.x >= player.x - 50 &&
      boss.x <= player.x + 50 &&
      boss.y >= player.y - 10000 &&
      // Atrás
      boss.y <= player.y + 10 &&
      /* Evitar que o boss tome dano fora da tela antes de aparecer */
      bossSpawned
    ) {
      boss.dmg();
    }

    // Final do if img_laser
  }

  // Movendo a nave
  player.move();
  player.render();




  
  /*--------------------------*/
  /*   Gerador de Inimigos   */
  /*------------------------*/

  /* ------ Lógica da Geração de Inimigos ------ */
  /*
   A variável 'framecount' serve pra contar quantos frames foram exibidos desde o ínicio da execução do script
   
   A geração de inimigos se utiliza desse recurso para criar a seguinte lógica:
  
   1- Cada vez que o resto da divisão do N° de frames por 60 é igual a 0, gera 1 inimigo
   2- A cada 100 pontos o divisor (60) diminui 1
   3- Quanto menor o divisor, maior é a chance do resto ser 0
   4- Portanto, a geração de inimigos fica cada vez mais rápida
   5- Então a geração de inimigos aumenta a cada 100 pontos
   
   Por exemplo:
  
   100 pontos = 60 - 1 = 59
   200 pontos = 60 - 2 = 58
   5900 pontos = 60 - 59 = 1

   Com isso, o máximo de pontos que o player pode alcançar é 5900,
   Pois quando o divisor for 1 cada divisão terá resto 0,
   Ou seja, a cada frame será gerado 1 inimigo, deixando o jogo impossível
  
   Mesmo assim, é improvável que alguém consiga essa pontuação sem trapaças
  */

  /* Dificuldade */
  let gameDifficulty = floor(score / 100);

  // Se o boss não estiver na tela, spawn normal
  if (!bossSpawned) {
    if (frameCount % (60 - gameDifficulty) === 0) {
      enemies.push(new Enemy());
    }
    if (frameCount % (100 - gameDifficulty) == 0) {
      asteroids.push(new Asteroid());
    }
  }
  // Se o boss estiver na tela, diminui o spawn
  else if (bossSpawned) {
    if (frameCount % (120 - gameDifficulty) === 0) {
      enemies.push(new Enemy());
    }
    if (frameCount % (200 - gameDifficulty) == 0) {
      asteroids.push(new Asteroid());
    }
  }



  /* ------ Naves inimigas ------ */
  
  // Mover e mostrar os inimigos
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].move();
    enemies[i].render();

    // Verificar se saiu da tela
    if (enemies[i].offscreen() && !isGodMode) {
      gameOver("enemy");
      return;
    }

    // Verificar colisão com a nave
    if (enemies[i].hits(player) && !isGodMode) {
      image(img_explo, player.x - 30, player.y - 30, 80, 80);
      gameOver("collision");
      return;
    }

    // Verificar colisão com os tiros
    for (let j = shoots.length - 1; j >= 0; j--) {
      if (shoots[j].hits(enemies[i])) {
        explosions.push(new Explosion(enemies[i].x, enemies[i].y, 60));
        enemies.splice(i, 1);
        shoots.splice(j, 1);
        score += 10;
        defeatedEnemies += 1;
        break;
      }
    }
  }

  // Tiro dos inimigos
  if (millis() - lastEnemyShootTime >= enemyShootInterval) {
    enemies.forEach(enemy => {
      // Fazer com que cada inimigo atire individualmente
      enemy.shoot();
    });
    // Atualizar o último momento em que o inimigo atirou
    lastEnemyShootTime = millis(); 
  }

  // Aumentar a velocidade dos inimigos de acordo com os pontos
  enemySpeed = 2 + score / 200;



  /* ------ Asteroides ------ */
  
  // Mover e mostrar asteroides
  for (let i = asteroids.length - 1; i >= 0; i--) {
    asteroids[i].move();
    asteroids[i].render();

    // Verificar colisão com a nave
    if (asteroids[i].hits(player) && !isGodMode) {
      image(img_explo, player.x - 30, player.y - 30, 80, 80);
      gameOver("collision");
      return;
    }

    // Verificar colisão com os tiros
    for (let j = shoots.length - 1; j >= 0; j--) {
      if (shoots[j].hits(asteroids[i])) {
        explosions.push(new Explosion(asteroids[i].x, asteroids[i].y, 60));
        asteroids.splice(i, 1);
        shoots.splice(j, 1);
        score += 10;
        break;
      }
    }
  }

  
  
  /* ------ Explosões ------ */
  
  // Movendo e mostrando as explosões
  for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].render();
    if (explosions[i].finished()) {
      explosions.splice(i, 1);
    }
  }



  /* ------ Tiros do jogador ------ */
  
  // Mover e mostrar os tiros
  for (let i = shoots.length - 1; i >= 0; i--) {
    shoots[i].move();
    shoots[i].render();

    // Remover os tiros que saem da tela
    if (shoots[i].offscreen()) {
      shoots.splice(i, 1);
    }
  }





  /*----------------*/
  /*   Pontuação   */
  /*--------------*/
  fill(255);
  textSize(20);
  textAlign(LEFT, BASELINE);
  textFont(font_arcade);
  strokeWeight(4);
  stroke("black");
  
  image(img_scores, 20, 20, 176, 98);    // Hud
  text(score, 70, 50);                  // Pontos

  // [DEBUG]
  if (isDebugMode) {
    text("Dificuldade: " + gameDifficulty, 30, 150);
    text("God Mode: " + isGodMode, 30, 170);
  }

  // Calcular o tempo decorrido em seconds
  if (!isTimePaused) {
    elapsedTime = floor((millis() - startTime) / 1000);
  }

  // Calcular os minutos e segundos
  let minutes = floor(elapsedTime / 60);
  let seconds = elapsedTime % 60;

  // Formatar os minutos e os segundos com dois dígitos
  let formattedMinutes = nf(minutes, 2);
  let formattedSeconds = nf(seconds, 2);

  // Exibir o tempo na tela
  textAlign(LEFT, BASELINE);
  text(formattedMinutes + ":" + formattedSeconds, 70, 102);





  /*---------------*/
  /*    Barras    */
  /*-------------*/

  // Base para as barras
  image(img_bar_base, 15, height - 70, 138, 57);

  // Barra de HP
  for (let i = 5; i >= 1; i--) {
    if (player.hp == i) {
      image(window["img_bar_hp_" + i], 15, height - 70, 138, 57);
      break;
    }
  }


  /*
  
  Lógica:
  - Pegar o valor do cooldown até o limite, divir por 30, o que dá 5
  - A barra é dividida em 5 partes, então ela vai aumentando com a divisão
  
  */
  let cooldownProgress = map(
    millis() - laserActivatedTime,
    0,
    laserCooldown,
    0,
    cooldownLimit
  );

  cooldownProgress1 = constrain(cooldownProgress, 0, cooldownLimit);
  cooldownProgress2 = floor(cooldownProgress1 / 30);

  // [DEBUG]
  if (isDebugMode) {
    text(cooldownProgress1, 160, height - 45);
    text(player.hp, 160, height - 25);
  }

  // Barra do Laser
  for (let i = 5; i >= 1; i--) {
    if (cooldownProgress2 >= i) {
      image(window["img_bar_sa_" + i], 15, height - 70, 138, 57);
      break;
    }
  }





  /*---------------------*/
  /*    Jogo Pausado    */
  /*-------------------*/
  if (isGamePaused) {
    fill(0, 0, 0, 120);
    rect(0, 0, 500, 700);
    fill(255);
    textSize(30);
    textAlign(CENTER, CENTER);
    text("JOGO PAUSADO", width / 2, height / 2 - 20);
  }
  
// FINAL DO DRAW
}





/*---------------------------*/
/*    Controles do Mouse    */
/*-------------------------*/

/*  Mouse  */
function mousePressed() {
  
  /* Click Direito (Ataque Especial de Laser) */
  if (mouseButton === RIGHT && canShoot && !isGameOver && !isGamePaused) {
    if (millis() - laserActivatedTime >= laserCooldown) {
      snd_laser.setVolume(2);
      snd_laser.loop();
      canShoot = false;
      isLaserActive = true;
      laserActivatedTime = millis();

      // Parar o laser após passar da duranção
      setTimeout(() => {
        snd_laser.stop();
        canShoot = true;
        isLaserActive = false;
      }, laserDuration);
    }
  }
  
  /*  Click Esquerdo (Tiro normal)  */
  else if (mouseButton === LEFT && canShoot && !isGameOver && !isGamePaused) {
    shoots.push(new PlayerShoot(player.x, player.y - 10));
    canShoot = false;

    // Delay entre os tiros
    setTimeout(() => {
      canShoot = true;
    }, 200);
  }
}





/*-----------------------------*/
/*    Controles do Teclado    */
/*---------------------------*/
function keyPressed() {
  
  /* Enter (Reiniciar o jogo) */
  if (keyCode === ENTER) {
    // Tecla Enter para reiniciar o jogo
    resetGame();

  /* D (Ativar Debug Mode) */
  } else if (keyCode === 68 && !isDebugMode) {
    isDebugMode = true;

  /* D (Desativar Debug Mode e God Mode) */
  } else if (keyCode === 68 && isDebugMode) {
    isGodMode = false;
    laserCooldown = 15000;
    isDebugMode = false;

  /* G (Ativar God Mode durante o Debug) */
  } else if (keyCode === 71 && isDebugMode) {
    isGodMode = true;
    laserCooldown = 0;
    
    
  /* BACKSPACE (Pausar o jogo) */
  } else if (keyCode === BACKSPACE && !isGamePaused && !isGameOver) {
    
    // Se NÃO estiver pausado:
    noLoop();                   // Quebra o loop
    isGamePaused = true;       // Define que está pausado

  // Se ESTIVER:
  } else if (isGamePaused && !isGameOver) {
    loop();                   // Continua o loop
    isGamePaused = false;    // Define que não está pausado
  }
}





/*------------------*/
/*    Game Over    */
/*----------------*/
function gameOver(cause) {
  
  isTimePaused = true;
  isGameOver = true;
  snd_music.stop();
  snd_explo.setVolume(2);
  snd_explo.play();
  
  // Estilo do texto
  fill(255);
  textSize(30);
  textAlign(CENTER, CENTER);
  strokeWeight(4);
  stroke("black");

  // Mensagem que muda de acordo com a causa da derrota
  let message = "";
  switch (cause) {
    case "collision":
      message = "GAME OVER!\nA NAVE COLIDIU!";
      break;
    case "shot":
      message = "GAME OVER!\nA NAVE FOI ABATIDA!";
      break;
    case "enemy":
      message = "GAME OVER!\nA DEFESSA FALHOU!";
      break;
    default:
      message = "GAME OVER!";
      break;
  }
  
  // Texto
  text(message, width / 2, height / 2 - 50);

  // Calcular os minutos e segundos
  let minutes = floor(elapsedTime / 60);
  let seconds = elapsedTime % 60;

  // FormataR os minutos e segundos com dois dígitos
  let formattedMinutes = nf(minutes, 2);
  let formattedSeconds = nf(seconds, 2);

  // Resto do texto
  fill(255);
  textSize(20);
  text("SEUS PONTOS: " + score, width / 2, height / 2 + 20);
  text(
    "TEMPO SOBREVIVIDO: " + formattedMinutes + ":" + formattedSeconds,
    width / 2,
    height / 2 + 45
  );
  text("INIMIGOS DERROTADOS: " + defeatedEnemies, width / 2, height / 2 + 70);

  noLoop(); // Quebra o loop do jogo
}





/*-------------------------*/
/*    Reiniciar o jogo    */
/*-----------------------*/
function resetGame() {
  if (!isGamePaused && isGameOver) {
    defeatedEnemies = 0;
    startTime = millis();
    elapsedTime = 0;
    isTimePaused = false;
    isGodMode = false;
    isDebugMode = false;
    isGameOver = false;
    snd_music.stop();
    score = 0;
    enemies = [];
    shoots = [];
    EnemyShoots = [];
    explosions = [];
    asteroids = [];
    laserActivatedTime = 0;
    cooldownProgress = 0;
    playerHP = 5;
    player = new Player();
    bossSpawned = false;
    snd_alarm.stop();
    snd_music.loop();
    loop();
  }
}





/*----------------*/
/*    Classes    */
/*--------------*/

/* ---- Nave do Jogador ---- */
class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.hp = playerHP;
  }

  move() {
    // Mover a nave de acordo com o mouse
    this.x = mouseX;
    this.y = mouseY;

    
    /* {Limitador de posição} */

    // Direita
    if (this.x > width - 30) {
      this.x = width - 30;
    // Esquerda
    } else if (this.x < 30) {
      this.x = 30;
    }

    // Baixo
    if (this.y > height - 30) {
      this.y = height - 30;
    // Cima
    } else if (this.y < 20) {
      this.y = 20;
    }
  }

  /* {Renderizador} */
  render() {
    /* [DEBUG] */
    if (isDebugMode) {
      /* Coordenadas */
      fill(255);
      text("X: " + this.x, 30, height - 80);
      text("Y: " + this.y, 30, height - 100);
      /* Hitbox */
      noStroke();
      fill(255, 0, 0, 150);
      ellipse(this.x, this.y, 64, 64);
    }

    /*
    Animar o sprite da Nave
    
    OBS:
    Eu tentei utilizar 3 métodos de botar gif e nenhum deles funcionou da maneira que eu queria.
    Por isso, fiz esse sistema para ele trocar o frame da animação.
    O importante é que funciona :)
    */

    if (sprite1) {
      image(img_player_1, this.x - 32, this.y - 25, 64, 64);
      setTimeout(() => {
        sprite1 = false;
      }, 100);
    } else {
      image(img_player_2, this.x - 32, this.y - 25, 64, 64);
      setTimeout(() => {
        sprite1 = true;
      }, 100);
    }
  }
  
  // Tomar dano
  dmg(cause) {
    snd_dmg.setVolume(2);
    snd_dmg.play();
    this.hp--;
    if (this.hp == 0) {
      snd_alarm.stop();
      explosions.push(new Explosion(this.x - 25, this.y - 15, 80));
      gameOver(cause);
    }
  }
}



/* ---- Tiro da Nave ---- */
class PlayerShoot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 15;
    snd_player_shoot.setVolume(1.5);
    snd_player_shoot.play();
  }

  move() {
    this.y -= this.speed;
  }

  /* {Renderizador} */
  render() {
    // [DEBUG]
    if (isDebugMode) {
      /* Hitbox */
      noStroke();
      fill(255, 0, 0, 150);
      ellipse(this.x, this.y, 40, 40);
    }

    /* Sprite do Tiro */
    image(img_player_shoot, this.x - 13, this.y - 15, 26, 26);
  }

  /* Verificar se saiu da tela */
  offscreen() {
    return this.y < 0;
  }

  /* Verificar hit */
  hits(enemy) {
    let d = dist(this.x, this.y, enemy.x, enemy.y);
    return d < 40;
  }

  hit(boss) {
    let d = dist(this.x, this.y, boss.x, boss.y);
    return d < 40;
  }
}



/* ---- Nave Inimiga ---- */
class Enemy {
  constructor() {
    this.x = random(40, width - 40);
    this.y = 0;
    this.speed = enemySpeed;
  }

  move() {
    this.y += this.speed;
  }

  render() {
    if (isDebugMode) {
      /* Hitbox */
      noStroke();
      fill(255, 0, 0, 150);
      ellipse(this.x, this.y, 50, 50);
    }

    if (sprite1) {
      image(img_enemy_1, this.x - 28, this.y - 30, 56, 56);
      setTimeout(() => {
        sprite1 = false;
      }, 100);
    } else {
      image(img_enemy_2, this.x - 28, this.y - 30, 56, 56);
      setTimeout(() => {
        sprite1 = true;
      }, 100);
    }
  }

  offscreen() {
    return this.y > height;
  }

  shoot() {
    EnemyShoots.push(new EnemyShoot(this.x, this.y)); // Cria um novo tiro do inimigo
  }

  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < 30;
  }
}



/* ---- Tiro da Nave Inimiga ---- */
class EnemyShoot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = enemySpeed * 2;
    snd_enemy_shoot.setVolume(0.6);
    snd_enemy_shoot.play();
  }

  move() {
    this.y += this.speed;
  }

  render() {
    if (isDebugMode) {
      /* Hitbox */
      noStroke();
      fill(255, 0, 0, 150);
      ellipse(this.x, this.y, 50, 50);
    }

    image(img_enemy_shoot, this.x - 14, this.y - 20, 28, 28);
  }

  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < 38;
  }

  offscreen() {
    return this.y > height;
  }
}



/* ---- Explosão ---- */
class Explosion {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.timer = 60;
    this.size = size;
    snd_explo.setVolume(0.5);
    snd_explo.play();
  }

  /* {Renderizador} */
  render() {
    if (this.timer > 0) {
      // SE o timer for maior que 0:
      image(img_explo, this.x - 15, this.y - 15, this.size, this.size);  // Colocar a imagem
      this.y += enemySpeed;                                             // Continuar movendo na vel. do inimigo
      this.timer--;                                                    // Diminuir o timer
    }
  }

  /* Terminar explosão */
  finished() {
    return this.timer <= 0;
  }
}



/* ---- Explosão ---- */
class BossExplosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.timer = 60;
    snd_explo.setVolume(5);
    snd_explo.play();
  }

  /* {Renderizador} */
  render() {
    if (this.timer > 0) {
      // SE o timer for maior que 0:
      image(img_boss_explo, this.x - 120, this.y - 120, 244, 244); // Colocar a imagem
      this.y += enemySpeed; // Continuar movendo na vel. do inimigo
      this.timer--; // Diminuir o timer
    }
  }

  /* Terminar explosão */
  finished() {
    return this.timer <= 0;
  }
}



/* ---- Asteroide ---- */
class Asteroid {
  constructor() {
    this.x = random(40, width - 40);
    this.y = 0;
    this.speed = enemySpeed * 1.5;
    this.sprite = random([img_ast_1, img_ast_2, img_ast_3]);
    this.pos_fix = 0;
    this.sprite_size = 0;

    if (this.sprite == img_ast_1) {
      this.pos_fix = 16;
      this.sprite_size = 30;
    } else if (this.sprite == img_ast_2) {
      this.pos_fix = 20;
      this.sprite_size = 42;
    } else if (this.sprite == img_ast_3) {
      this.pos_fix = 30;
      this.sprite_size = 66;
    }
  }

  move() {
    this.y += this.speed;
  }

  /* {Renderizador} */
  render() {
    if (isDebugMode) {
      /* Hitbox */
      noStroke();
      fill(255, 0, 0, 150);
      ellipse(this.x, this.y, 50, 50);
    }

    image(
      this.sprite,
      this.x - this.pos_fix,
      this.y - this.pos_fix,
      this.sprite_size,
      this.sprite_size
    );
  }

  offscreen() {
    return this.y > height;
  }

  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < 60;
  }
}



/* ---- Boss ---- */
class Boss {
  constructor() {
    this.x = width / 2;
    this.y = -100;
    this.speed = 0.8;
    this.hp = 20;
    this.canShoot = true;
    this.lastShootTime = 0;
    this.timer = 5;
  }

  move() {
    this.y += this.speed;
    if (this.y > height + 100) {
      this.spawn();
    }
  }

  spawn() {
    this.x = random(40, width - 40);
    this.y = -100;
    this.hp = 20;
    this.canShoot = true;
    this.lastShootTime = 0;
  }

  render() {
    if (boss.hp <= 0) {
      bossSpawned = false;
    }

    if (isDebugMode) {
      /* Hitbox */
      noStroke();
      fill(255, 0, 0, 150);
      ellipse(this.x, this.y, 100, 100);
    }

    if (sprite1) {
      image(img_boss_1, this.x - 50, this.y - 50, 100, 100);
      setTimeout(() => {
        sprite1 = false;
      }, 100);
    } else {
      image(img_boss_2, this.x - 50, this.y - 50, 100, 100);
      setTimeout(() => {
        sprite1 = true;
      }, 100);
    }
  }

  offscreen() {
    return this.y > height + 100;
  }

  shoot() {
    if (millis() - this.lastShootTime >= 3000) {
      EnemyShoots.push(new BossShoot(this.x + 2, this.y));
      this.lastShootTime = millis();
    }
  }

  dmg() {
    this.hp--;
    if (this.hp == 0) {
      snd_alarm.stop();
      explosions.push(new BossExplosion(this.x, this.y));
      score += 20;
    }
  }

  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < 30;
  }
}



/* ---- Tiro do Boss ---- */
class BossShoot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = enemySpeed * 2;
    snd_enemy_shoot.setVolume(0.6);
    snd_enemy_shoot.play();
  }

  move() {
    this.y += this.speed;
  }

  render() {
    if (isDebugMode) {
      /* Hitbox */
      noStroke();
      fill(255, 0, 0, 150);
      ellipse(this.x, this.y, 50, 50);
    }

    image(img_boss_shoot, this.x - 20, this.y - 30, 38, 54);
  }

  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < 38;
  }

  offscreen() {
    return this.y > height;
  }
}