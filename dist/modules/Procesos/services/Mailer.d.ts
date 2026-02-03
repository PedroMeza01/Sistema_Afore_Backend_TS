export declare const Mailer: {
    send: (input: {
        to: string | string[];
        subject: string;
        html: string;
    }) => Promise<any>;
};
