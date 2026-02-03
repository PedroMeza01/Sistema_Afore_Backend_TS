import { Response } from 'express';
import { AuthedRequest } from '../../../middleware/auth';
export declare class DashboardController {
    static getDashboard: (req: AuthedRequest, res: Response) => Promise<void>;
}
