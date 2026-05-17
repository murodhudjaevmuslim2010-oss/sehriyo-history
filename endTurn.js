// ============================================
// END TURN SYSTEM - 2history
// ============================================

game.gameDate = new Date(1939, 0, 1); // 01.01.1939

game.formatDate = function(date) {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}.${m}.${y}`;
};

game.initEndTurnButton = function() {
    const btn = document.getElementById('endTurnBtn');
    const feed = document.getElementById('newsFeed');
    if (btn) {
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.onclick = () => this.confirmEndTurn();
    }
    if (feed) feed.style.display = 'block';
    this.addNews('Игра началась. Дата: ' + this.formatDate(this.gameDate), 'info');
};

game.confirmEndTurn = async function() {
    const modal = document.getElementById('endTurnConfirmModal');
    if (!modal) {
        if (await this.showConfirm('Завершить текущий этап?')) this.processEndTurn();
        return;
    }

    // Заполнение данных
    document.getElementById('confirmCurrentDate').textContent = this.formatDate(this.gameDate);
    
    // Расчет ожидаемой добычи
    const pm = this.state.politicalMode;
    const productionStats = { wood: 0, coal: 0, iron: 0, oil: 0, gold: 0, food: 0, leather: 0 };
    this.state.territories.forEach(t => {
        if (t.captured && t.owner === 'player') {
            const resourceType = pm.territoryResources[t.id];
            if (resourceType) productionStats[resourceType]++;
        }
    });

    const list = document.getElementById('confirmProductionList');
    list.innerHTML = '';
    for (let res in productionStats) {
        if (productionStats[res] > 0) {
            const item = document.createElement('div');
            item.className = 'prod-estimate-item';
            item.innerHTML = `
                <i class="${this.getResourceIcon ? this.getResourceIcon(res) : 'fas fa-cube'}"></i>
                <div class="val">+${productionStats[res]}</div>
            `;
            list.appendChild(item);
        }
    }

    modal.style.display = 'flex';

    // Биндинг кнопок
    document.getElementById('executeEndTurnBtn').onclick = () => {
        modal.style.display = 'none';
        this.processEndTurn();
    };
    document.getElementById('closeEndTurnModal').onclick = () => {
        modal.style.display = 'none';
    };
};

game.addNews = function(text, type) {
    type = type || 'info';
    const container = document.getElementById('newsItems');
    if (!container) return;
    const icons = { war: '⚔️', ally: '🤝', neutral: '🕊️', info: '📌', capture: '🏴', production: '📦' };
    const colors = { war: '#ef5350', ally: '#4caf50', neutral: '#b0bec5', info: '#d4af37', capture: '#ff9800', production: '#81c784' };
    const item = document.createElement('div');
    item.style.cssText = 'padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.07); color:' + (colors[type] || '#ccc') + '; font-size:0.78rem;';
    item.textContent = (icons[type] || '•') + ' ' + text;
    container.insertBefore(item, container.firstChild);
    while (container.children.length > 15) container.removeChild(container.lastChild);
};

game.processEndTurn = function() {
    const pm = this.state.politicalMode;
    if (!pm || !pm.botCountries) return;
    
    // Сброс счетчика новых войн за этот ход
    pm.newWarsThisTurn = 0;

    // --- Обработка игнорируемых атак ---
    // Если игрок завершил ход, не отбив атаку, территория захватывается автоматически
    this.state.territories.forEach(t => {
        if (t.owner === 'player' && t.pendingAttack) {
            const attackerName = t.pendingAttack.attacker;
            const bot = pm.botCountries.find(b => b.name === attackerName);
            
            t.owner = attackerName;
            t.army = 15; // Бот оставляет гарнизон
            
            // Очищаем данные об атаке ДО обновления стиля
            const prevAttack = t.pendingAttack;
            delete t.pendingAttack;
            
            if (this.removeAttackMarker) this.removeAttackMarker(t);
            this.updateTerritoryStyle(t.id);
            
            this.addNews(`🚩 Потеряно! ${t.name} сдана врагу (${bot ? bot.empireName : attackerName}) без боя.`, 'war');
            this.showNotification(`Вы потеряли ${t.name}, так как проигнорировали атаку!`, 'error');
        }
    });


    // 1. Продакшн ресурсов (1 территория = 1 ресурс)
    const productionStats = { wood: 0, coal: 0, iron: 0, oil: 0, gold: 0, food: 0, leather: 0 };
    
    this.state.territories.forEach(t => {
        if (t.captured && t.owner) {
            const resourceType = pm.territoryResources[t.id];
            if (resourceType) {
                if (t.owner === 'player') {
                    const level = pm.resourceLevels[resourceType] || 1;
                    pm.resources[resourceType] = (pm.resources[resourceType] || 0) + level;
                    productionStats[resourceType] += level;
                } else if (t.owner.startsWith('bot')) {
                    const bot = pm.botCountries.find(b => b.name === t.owner);
                    if (bot) {
                        bot.resources[resourceType] = (bot.resources[resourceType] || 0) + 1;
                    }
                }
            }
        }
    });

    // Уведомление о добыче для игрока
    let prodSummary = [];
    for (let res in productionStats) {
        if (productionStats[res] > 0) prodSummary.push(`${productionStats[res]} ${this.getResourceName(res).toLowerCase()}`);
    }
    if (prodSummary.length > 0) {
        this.addNews('Добыто за месяц: ' + prodSummary.join(', '), 'production');
    }


    // --- Логика расходов на армию и Революции ---
    let totalUnits = 0;
    for (let uid in pm.army) {
        totalUnits += pm.army[uid];
    }
    const maintenance = totalUnits * 6;
    const prevCoins = pm.resources.coins || 0;
    pm.resources.coins = prevCoins - maintenance;

    if (pm.resources.coins < 0) {
        if (prevCoins >= 0) {
            this.showNotification("Экономика страны падает!", "warning");
        }
        pm.goldDebtTurns = (pm.goldDebtTurns || 0) + 1;
        this.addNews(`⚠️ КАЗНА ПУСТА! Дефицит: ${Math.abs(pm.resources.coins)} монет. Ходов до революции: ${4 - pm.goldDebtTurns}`, 'war');
        
        if (pm.goldDebtTurns >= 4) {
            // РЕВОЛЮЦИЯ
            const playerTerritories = this.state.territories.filter(t => t.owner === 'player');
            const revoltCount = Math.floor(playerTerritories.length * 0.2);
            
            if (revoltCount > 0) {
                const shuffled = [...playerTerritories].sort(() => 0.5 - Math.random());
                const revolting = shuffled.slice(0, revoltCount);
                
                revolting.forEach(t => {
                    t.owner = 'neutral'; // Становятся свободными землями (зелеными)
                });
                
                this.addNews(`🔥 РЕВОЛЮЦИЯ! Из-за банкротства ${revoltCount} территорий объявили независимость!`, 'war');
                this.showNotification("Из за революции, вы потеряли земли", "error");
                
                pm.goldDebtTurns = 0;
                pm.resources.coins = 0; // Сброс в ноль для нового старта
                
                if (this.refreshMapStyles) this.refreshMapStyles();
            }
        }
    } else {
        if (pm.goldDebtTurns > 0) {
            this.showNotification("Экономика - стабильна!", "success");
        }
        pm.goldDebtTurns = 0;
    }

    // --- Обновление торговых предложений ---
    if (this.generateTradeOrders) {
        this.generateTradeOrders();
    }

    // 2. Сдвиг даты (на следующий месяц, случайный день)

    const nextMonth = new Date(this.gameDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const randomDay = Math.floor(Math.random() * 28) + 1;
    nextMonth.setDate(randomDay);
    this.gameDate = nextMonth;

    this.addNews('━━ Период до ' + this.formatDate(this.gameDate) + ' ━━', 'info');

    // 3. Логика ботов
    pm.botCountries.forEach(bot => {
        const botTerritories = this.state.territories.filter(t => t.owner === bot.name);
        if (botTerritories.length === 0) return;

        // --- Diplomacy between bots ---
        pm.botCountries.forEach(other => {
            if (other.name === bot.name) return;
            const rel = this.getDiplomacyRelation(bot.name, other.name);
            const otherTerrs = this.state.territories.filter(t => t.owner === other.name);

            if (rel === 'neutral') {
                const roll = Math.random();
                if (roll < 0.10) {
                    this.setDiplomacyRelation(bot.name, other.name, 'war');
                    this.addNews(bot.empireName + ' объявил войну ' + other.empireName + '!', 'war');
                } else if (roll < 0.20 && otherTerrs.length > 0) {
                    this.setDiplomacyRelation(bot.name, other.name, 'ally');
                    this.addNews(bot.empireName + ' и ' + other.empireName + ' заключили союз!', 'ally');
                }
            } else if (rel === 'war') {
                if (botTerritories.length > 0 && otherTerrs.length > 0 && Math.random() > 0.7) {
                    const source = botTerritories[Math.floor(Math.random() * botTerritories.length)];
                    const target = otherTerrs[Math.floor(Math.random() * otherTerrs.length)];
                    const neighbors = (pm.territoryNeighbors || {})[source.id] || [];
                    if (neighbors.includes(target.id)) {
                        this.executeAttack(source, target);
                    }
                }
            } else if (rel === 'ally') {
                if (Math.random() < 0.05) {
                    this.setDiplomacyRelation(bot.name, other.name, 'neutral');
                    this.addNews(bot.empireName + ' разорвал союз с ' + other.empireName + '.', 'neutral');
                }
            }
        });
        
        // --- Neutral Expansion ---
        // Бот может захватывать нейтральные земли, если они граничат с ним
        botTerritories.forEach(t => {
            const neighbors = (pm.territoryNeighbors || {})[t.id] || [];
            neighbors.forEach(nId => {
                const target = this.state.territories.find(nt => nt.id === nId);
                if (target && (target.owner === 'neutral' || !target.owner)) {
                    // Шанс 25% на захват нейтральной зоны в месяц
                    if (Math.random() < 0.25) {
                        target.owner = bot.name;
                        target.captured = true;
                        target.army = 10; // Небольшой гарнизон
                        this.addNews(`${bot.empireName} занял нейтральные земли ${target.name}.`, 'neutral');
                    }
                }
            });
        });

        // --- Against player ---
        const relPlayer = this.getDiplomacyRelation(bot.name, 'player');
        const playerTerrs = this.state.territories.filter(t => t.owner === 'player');

        if (relPlayer === 'war') {
            // Умная атака: бот ищет соседние территории игрока
            let potentialAttacks = [];
            botTerritories.forEach(source => {
                const neighbors = (pm.territoryNeighbors || {})[source.id] || [];
                neighbors.forEach(nId => {
                    const target = playerTerrs.find(pt => pt.id === nId);
                    if (target && !target.pendingAttack) {
                        potentialAttacks.push({ source, target });
                    }
                });
            });

            if (potentialAttacks.length > 0 && Math.random() > 0.4) {
                const attack = potentialAttacks[Math.floor(Math.random() * potentialAttacks.length)];
                this.initiateBotAttack(attack.source, attack.target);
            }
        } else if (relPlayer === 'neutral') {
            // --- 1. ЛОГИКА ВОЙНЫ (Ультра-низкие шансы) ---
            const hasBorder = botTerritories.some(bt => {
                const neighbors = (pm.territoryNeighbors || {})[bt.id] || [];
                return neighbors.some(nId => playerTerrs.some(pt => pt.id === nId));
            });

            // Шансы: 2.5% если сосед, 0.5% если нет
            const warChance = hasBorder ? 0.025 : 0.005;
            
            // Считаем текущие войны игрока
            const currentWars = pm.botCountries.filter(b => this.getDiplomacyRelation(b.name, 'player') === 'war').length;
            
            // Глобальный лимит: 1 новая война за ход + запрет, если войн уже 2 или больше
            if (pm.newWarsThisTurn < 1 && currentWars < 2 && Math.random() < warChance) {
                this.setDiplomacyRelation(bot.name, 'player', 'war');
                this.addNews(`🚩 ${bot.empireName} объявил вам войну!`, 'war');
                pm.newWarsThisTurn++;
            }

            // --- 2. ЛОГИКА СОЮЗА (1.5% шанс) ---
            // Предлагают только если нет войн с игроком и шанс выпал
            if (currentWars === 0 && Math.random() < 0.015) {

                this.addNotification({
                    type: 'alliance_offer',
                    from: bot.name,
                    text: `Приветствуем! Мы, ${bot.empireName}, восхищены вашим правлением и предлагаем заключить официальный союз для взаимной защиты.`
                });
            }
        }



        // 3.1. Авторекрутинг бота (на основе ресурсов)
        if (bot.army) {
            this.units.forEach(unit => {
                let canAfford = true;
                for (let res in unit.cost) {
                    if ((bot.resources[res] || 0) < unit.cost[res]) {
                        canAfford = false;
                        break;
                    }
                }
                if (canAfford && Math.random() < 0.3) {
                    for (let res in unit.cost) bot.resources[res] -= unit.cost[res];
                    bot.army[unit.id] = (bot.army[unit.id] || 0) + 1;
                }
            });

            // 3.2. Распределение войск по территориям (особенно приграничным)
            botTerritories.forEach(t => {
                if (!t.garrison) t.garrison = {};
                
                // Шанс перебросить юнитов из резерва бота в гарнизон территории
                for (let uid in bot.army) {
                    if (bot.army[uid] > 0 && Math.random() < 0.2) {
                        const count = Math.ceil(bot.army[uid] * 0.3);
                        t.garrison[uid] = (t.garrison[uid] || 0) + count;
                        bot.army[uid] -= count;
                    }
                }
            });
        }
    });



    // 4. Процесс производства войск
    this.processProduction();

    // Восполнение очков действий на новый этап
    pm.actionsLeft = 4;
    this.updateActionsUI();

    // 5. Обновление UI
    this.updateResourceUI();
    this.showYearToast(this.formatDate(this.gameDate));

    // 6. Обновление карты (единоразово в конце хода, чтобы избежать зависаний)
    if (this.refreshMapStyles) this.refreshMapStyles();
};

game.findPath = function(startId, targetId) {
    const pm = this.state.politicalMode;
    if (!pm) return [targetId];
    const queue = [[startId, []]];
    const visited = new Set([startId]);
    while (queue.length > 0) {
        const [currId, path] = queue.shift();
        if (currId === targetId) return path;
        const neighbors = (pm.territoryNeighbors || {})[currId] || [];
        for (let n of neighbors) {
            if (!visited.has(n)) {
                visited.add(n);
                queue.push([n, [...path, n]]);
            }
        }
    }
    return [targetId];
};

game.showYearToast = function(dateStr) {
    let toast = document.getElementById('yearToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'yearToast';
        toast.style.cssText = [
            'position:fixed', 'top:80px', 'left:50%', 'transform:translateX(-50%)',
            'background:linear-gradient(135deg,#1a1a2e,#16213e)',
            'border:2px solid #d4af37', 'border-radius:12px',
            'padding:12px 30px', 'color:#d4af37', 'font-size:1.4rem',
            'font-weight:bold', 'z-index:99999', 'pointer-events:none',
            'transition:opacity 0.6s'
        ].join(';');
        document.body.appendChild(toast);
    }
    toast.innerHTML = '<i class="fas fa-calendar-alt"></i> ' + dateStr;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 2500);
};

// Hook: show button when political game starts
(function() {
    const orig = game.startPoliticalGame;
    game.startPoliticalGame = function(playerCountry) {
        orig.call(this, playerCountry);
        game.gameDate = new Date(1939, 0, 1); // Сброс даты при старте
        setTimeout(() => this.initEndTurnButton(), 1600);
    };
})();
