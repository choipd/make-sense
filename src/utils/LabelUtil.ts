import {
    HumanInfo,
    LabelName,
    LabelPolygon,
    LabelRect
} from '../store/labels/types';
import {v4 as uuidv4} from 'uuid';
import {find} from 'lodash';
import {IRect} from '../interfaces/IRect';
import {LabelStatus} from '../data/enums/LabelStatus';
import {IPoint} from '../interfaces/IPoint';
import {sample} from 'lodash';
import {Settings} from '../settings/Settings';
import {LabelsSelector} from '../store/selectors/LabelsSelector';

export class LabelUtil {
    public static createLabelName(name: string): LabelName {
        return {
            id: uuidv4(),
            name,
            color: sample(Settings.LABEL_COLORS_PALETTE)
        };
    }

    public static createLabelRect(labelId: string, rect: IRect): LabelRect {
        return {
            id: uuidv4(),
            labelId,
            rect,
            isCreatedByAI: false,
            status: LabelStatus.ACCEPTED,
            suggestedLabel: null,
            mode: LabelsSelector.getActiveLabelMode(),
           
        };
    }

    public static createLabelPolygon(
        labelId: string,
        vertices: IPoint[]
    ): LabelPolygon {
        return {
            id: uuidv4(),
            labelId,
            vertices
        };
    }

    public static labelNamesIdsDiff(
        oldLabelNames: LabelName[],
        newLabelNames: LabelName[]
    ): string[] {
        return oldLabelNames.reduce(
            (missingIds: string[], labelName: LabelName) => {
                if (!find(newLabelNames, {id: labelName.id})) {
                    missingIds.push(labelName.id);
                }
                return missingIds;
            },
            []
        );
    }
}
