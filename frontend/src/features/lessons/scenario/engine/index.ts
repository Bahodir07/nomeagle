export type { ScenarioSessionState, FeedbackType } from './scenarioSession.types';

export {
    createSession,
    selectChoice,
    evaluateChoice,
    nextStep,
    dismissWrong,
    getCurrentStep,
    getFeedbackMessage,
} from './scenarioSession.utils';
