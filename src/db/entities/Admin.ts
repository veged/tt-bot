import TelegramBot from "node-telegram-bot-api";
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { config } from "../../config";
import { logger } from "../../logger";

@Entity()
export class Admin extends BaseEntity {
    @PrimaryColumn()
    public chatId: number;

    @Column()
    public login: string;

    @Column({ default: "" })
    public currentCommand: string;

    static async identify(msg: TelegramBot.Message | TelegramBot.CallbackQuery) {
        let admin = await Admin.findOne({
            chatId: msg.from.id,
        });

        if (!admin) {
            if (!config.adminLogins.includes(msg.from.username)) {
                logger.info(`User ${msg.from.username} try to become an admin`);

                return;
            }
            admin = new Admin();
            admin.chatId = msg.from.id;
            admin.login = msg.from.username;

            await admin.save();
        }

        return admin;
    }
}