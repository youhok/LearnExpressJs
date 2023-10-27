const passport = require('passport');
const { Strategy } = require('passport-discord');
const DiscordUser = require('../database/schemas/DiscordUser');

passport.serializeUser((user, done) => {
    console.log('Serializing User...');
    console.log(user);
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    console.log('DeserializeUser User');
    console.log(id);
    try {
        const user = await DiscordUser.findById(id);
        if (!user) throw new Error('User not found');
        console.log(user);
        done(null, user);
    } catch (err) {
        consol.log(err);
        done(err, null);
    }
});

passport.use(
    new Strategy(
        {
            clientID: '1167380917325668363',
            clientSecret: 'ycFJ9xkTdraTEgcZM0y0Q6thxzpPpRE0',
            callbackURL: 'http://localhost:3001/api/v1/auth/discord/redirect',
            scope: ['identify'],
        },
        async (accessToken, refreahToken, profile, done) => {
            console.log(accessToken, refreahToken);
            console.log(profile);
            try {
                const discordUser = await DiscordUser.findOne({
                    discordId: profile.id,
                });
                if (discordUser) {
                    console.log(`Found User: ${discordUser}`);
                    return done(null, discordUser);
                } else {
                    const newUser = await DiscordUser.create({
                        discordId: profile.id,
                    });
                    console.log(`Create User ${newUser}`);
                    return done(null, newUser);
                }
            } catch (err) {
                return done(err, null);
            }
        }
    )
);