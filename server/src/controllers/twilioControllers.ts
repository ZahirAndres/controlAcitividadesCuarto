import { Request, Response } from "express";
import Twilio from 'twilio';

const ACCOUNT_SID = 'AC9899d82bc620f8d76e950489393ad9f4'; 
const AUTH_TOKEN = 'bbf6107c6378bd02c2f4f4fee22f2914';
const SERVICE_SID = 'VAff91cf733462653749ce4790a12e1030';

const client = Twilio(ACCOUNT_SID, AUTH_TOKEN);

class TwilioControllers {
    public async startVerification(req: Request, res: Response): Promise<void> {
        const { phoneNumber } = req.body;

        try {
            const verification = await client.verify.services(SERVICE_SID)
                .verifications
                .create({ to: phoneNumber, channel: 'sms' });
            res.status(200).json(verification);
        } catch (error) {
            console.error('Error starting verification:', error);
            res.status(500).json({ message: 'Error starting verification', error });
        }
    }

    public async checkVerification(req: Request, res: Response): Promise<void> {
        const { phoneNumber, code } = req.body;

        try {
            const verificationCheck = await client.verify.services(SERVICE_SID)
                .verificationChecks
                .create({ to: phoneNumber, code });
            res.status(200).json(verificationCheck);
        } catch (error) {
            console.error('Error checking verification:', error);
            res.status(500).json({ message: 'Error checking verification', error });
        }
    }
}

export const twilioControllers = new TwilioControllers();
