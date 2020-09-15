class ChatDamageButtons5e extends Application {
    constructor(app) {
        super(app);
    }

    init () {

        Hooks.on('renderChatMessage', (message, html, data) => {            

            if ( !message.isRoll || message.roll.parts[0].faces == 20) return
            
                let btnStyling = 'width: 22px; height:22px; font-size:10px;line-height:1px';

                const fullDamageButton = $(`<button class="dice-total-fullDamage-btn" style="${btnStyling}"><i class="fas fa-user-minus" title="Click to apply full damage to selected token(s)."></i></button>`);
                const halfDamageButton = $(`<button class="dice-total-halfDamage-btn" style="${btnStyling}"><i class="fas fa-user-shield" title="Click to apply half damage to selected token(s)."></i></button>`);
                const doubleDamageButton = $(`<button class="dice-total-doubleDamage-btn" style="${btnStyling}"><i class="fas fa-user-injured" title="Click to apply double damage to selected token(s)."></i></button>`);
                const fullHealingButton = $(`<button class="dice-total-fullHealing-btn" style="${btnStyling}"><i class="fas fa-user-plus" title="Click to apply full healing to selected token(s)."></i></button>`);

                const btnContainer = $('<span class="dmgBtn-container" style="position:absolute; right:0; bottom:1px;"></span>');
                btnContainer.append(fullDamageButton);
                btnContainer.append(halfDamageButton);
                btnContainer.append(doubleDamageButton);
                btnContainer.append(fullHealingButton);

                html.find('.dice-total').append(btnContainer);
                
                const total = message._roll._total;

                // Handle button clicks
                fullDamageButton.click(ev => {
                    ev.stopPropagation();
                    this.getActorsAndApplyDamages(total, 1);
                });
                
                halfDamageButton.click(ev => {
                    ev.stopPropagation();
                    this.getActorsAndApplyDamages(total, 0.5);
                });

                doubleDamageButton.click(ev => {
                    ev.stopPropagation();
                    this.getActorsAndApplyDamages(total, 2);
                });

                fullHealingButton.click(ev => {
                    ev.stopPropagation();
                    this.getActorsAndApplyDamages(total, -1);
                });
            
        })
    }

    getActorsAndApplyDamages(dmg, modifier){

        // applying dmg to the targeted token and sending only the span that the button sits in 
        let targetActors = this.getTargetActors();
        for (let i=0; i<targetActors.length; i++) {
            targetActors[i].applyDamage(dmg, modifier);
        }
        setTimeout(() => { 
            if (canvas.hud.token._displayState && canvas.hud.token._displayState !== 0) {
                canvas.hud.token.render();
            }
        }, 50);

    }

    getTargetActors() {
        //const character = game.user.character;
        const controlled = canvas.tokens.controlled;
        let actors = [];
        //if ( controlled.length === 0 ) return [character] || null;
        if (controlled.length === 0) {
            console.warn(`You must designate a specific Token as the roll target.`);
            return ui.notifications.warn(`You must designate a specific Token as the roll target.`);
        }
        if ( controlled.length > 0 ) {
            let actors = [];
            for (let i = 0; i < controlled.length; i++) {
                actors.push(controlled[i].actor);
            }
            return actors;
        } else {
            console.warn(`You must designate a specific Token as the roll target.`);
        }
    }
}

let chatButtons = new ChatDamageButtons5e();
chatButtons.init();
