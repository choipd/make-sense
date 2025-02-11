import {store} from '../..';

export class AISelector {
    public static getScoreCriteria(): {
        gender: number,
        style: number,
        color: number,
        pattern: number,
        item: number    
    } {
        return store.getState().ai.scoreCriteria;
    }
    public static getSuggestedLabelList(): string[] {
        return store.getState().ai.suggestedLabelList;
    }

    public static getRejectedSuggestedLabelList(): string[] {
        return store.getState().ai.rejectedSuggestedLabelList;
    }

    public static isAIObjectDetectorModelLoaded(): boolean {
        return store.getState().ai.isObjectDetectorLoaded;
    }

    public static isAIPoseDetectorModelLoaded(): boolean {
        return store.getState().ai.isPoseDetectorLoaded;
    }

    public static isAIDisabled(): boolean {
        return store.getState().ai.isAIDisabled;
    }
}
