import {
    HumanInfo,
    ItemInfo,
    LabelName,
    LabelRect,
    RectJSON
} from '../../../store/labels/types';
import {LabelUtil} from '../../../utils/LabelUtil';
import {AnnotationsParsingError, LabelNamesNotUniqueError} from './MJErrors';
import {ISize} from '../../../interfaces/ISize';
import _, {uniq} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {LabelModeType} from '../../../data/enums/LabelType';
import {LabelStatus} from '../../../data/enums/LabelStatus';

export class MJUtils {
    public static parseLabelsNamesFromString(content: string): LabelName[] {
        return [];
        // const labelNames: string[] = content
        //     .split(/[\r\n]/)
        //     .filter(Boolean)
        //     .map((name: string) => name.replace(/\s/g, ''));

        // if (uniq(labelNames).length !== labelNames.length) {
        //     throw new LabelNamesNotUniqueError();
        // }

        // return labelNames.map((name: string) =>
        //     LabelUtil.createLabelName(name)
        // );
    }

    public static loadLabelsList(
        fileData: File,
        onSuccess: (labels: LabelName[]) => any,
        onFailure: () => any
    ) {
        const reader = new FileReader();
        reader.onloadend = function (evt: any) {
            const content: string = evt.target.result;
            const labelNames = MJUtils.parseLabelsNamesFromString(content);
            onSuccess(labelNames);
        };
        reader.onerror = () => onFailure();
        reader.readAsText(fileData);
    }

    public static parseMJAnnotationsFromJSON(
        rawAnnotation: string | object,
        labelNames: LabelName[],
        imageSize: ISize,
        imageName: string
    ): {labelRects: LabelRect[]; humans: HumanInfo[]; items: ItemInfo[]} {
        let annotation = rawAnnotation as RectJSON;
        if (typeof rawAnnotation === 'string') {
            annotation = JSON.parse(rawAnnotation) as RectJSON;
        }
        // console.log(131231, annotation)
         
        const humansLabelRects: LabelRect[] = annotation.human_info.map(
            (human) => {
                const {lt_x, lt_y, rb_x, rb_y} = human.bounding_box;
                const rectX: number = lt_x;
                const rectY: number = lt_y;
                const rectWidth: number = Math.abs(rb_x - lt_x);
                const rectHeight: number = Math.abs(rb_y - lt_y);
                const qc_status: string = human.qc_status
                const box_position_rejected: string = human.box_position_rejected
                const qc_comment: string = human.qc_comment
                // console.log('rect = ', rectX, rectY, rectWidth, rectHeight);
                const rect = {
                    x: rectX,
                    y: rectY,
                    width: rectWidth,
                    height: rectHeight,
                };
                if(!human?.style) {
                    human['style'] = ['UNKNOWN'];
                }
                const aLabel = LabelUtil.createLabelRect(human.style[0], rect);
                aLabel.mode = LabelModeType.HUMAN;
                aLabel.qc_status = qc_status
                aLabel.box_position_rejected = box_position_rejected
                aLabel.qc_comment = qc_comment
                return aLabel;
            }
        );
        const itemsLabelRects: LabelRect[] = annotation.item_info.map(
            (item) => {
                const {lt_x, lt_y, rb_x, rb_y} = item.bounding_box;
                const rectX: number = lt_x;
                const rectY: number = lt_y;
                const rectWidth: number = Math.abs(rb_x - lt_x);
                const rectHeight: number = Math.abs(rb_y - lt_y);
                const qc_status: string = item.qc_status
                const box_position_rejected: string = item.box_position_rejected
                const qc_comment: string = item.qc_comment
                // console.log('rect = ', rectX, rectY, rectWidth, rectHeight);
                const rect = {
                    x: rectX,
                    y: rectY,
                    width: rectWidth,
                    height: rectHeight
                };
                if(!item?.style) {
                    item['style'] = ['UNKNOWN']
                }
                const aLabel = LabelUtil.createLabelRect(item.style[0], rect);
                const [, , , , uuid, ,] = item.item_id.split(':');
                aLabel.mode = LabelModeType.ITEM;
                aLabel.id = uuid;
                aLabel.qc_status = qc_status
                aLabel.box_position_rejected = box_position_rejected
                aLabel.qc_comment = qc_comment
                return aLabel;
            }
        );

        const humans = annotation.human_info.map((human, humanIndex) => {
            const [id, gender, type] = human.human_id.split(':');

            return {
                uuid: humansLabelRects[humanIndex].id,
                id: parseInt(id),
                gender: parseInt(gender),
                type: parseInt(type),
                styles: human.style,
                styleScore: human.style_score?.split(":").map((score, i) => ({style: human.style_candidates.split(":")[i], score: parseFloat(score)})),
                genderScore: human.gender_score,
                qc_status: human.qc_status,
                qc_comment: human.qc_comment,
                box_position_rejected: human.box_position_rejected
            };
        });
        const items = annotation.item_info.map((item, itemIdx) => {
            const [
                humanIdx,
                gender,
                mainCategory,
                subCategory,
                uuid,
                color,
                pattern
            ] = item.item_id.split(':');
            return {
                uuid,
                id: itemIdx,
                humanId:
                    humans.find((human) => human.id === parseInt(humanIdx))
                        ?.uuid || '-1',
                gender: parseInt(gender),
                mainCategory: parseInt(mainCategory),
                subCategory: parseInt(subCategory),
                color: parseInt(color),
                pattern: parseInt(pattern),
                styles: item.style,
                colorScore: item.color_score?.split(":").map((score, i) => ({color: parseInt(item.colors.split(":")[i]), score: parseFloat(score)})),
                patternScore: item.pattern_score?.split(":").map((score, i) => ({pattern: parseInt(item.patterns.split(":")[i]), score: parseFloat(score)})),
                itemScore: item.item_score,
                qc_status: item.qc_status,
                qc_comment: item.qc_comment,
                box_position_rejected: item.box_position_rejected
            };
        });

        return {
            labelRects: [...humansLabelRects, ...itemsLabelRects],
            humans,
            items
        };
    }

    public static validateMJAnnotationComponents(
        components: RectJSON,
        labelNamesCount: number
    ): boolean {
        // const validateCoordinateValue = (rawValue: string): boolean => {
        //     const floatValue: number = Number(rawValue);
        //     return !isNaN(floatValue) && 0.0 <= floatValue && floatValue <= 1.0;
        // };
        // const validateLabelIdx = (rawValue: string): boolean => {
        //     const intValue: number = parseInt(rawValue);
        //     return (
        //         !isNaN(intValue) && 0 <= intValue && intValue < labelNamesCount
        //     );
        // };

        // return [
        //     components.length === 5,
        //     validateLabelIdx(components[0]),
        //     validateCoordinateValue(components[1]),
        //     validateCoordinateValue(components[2]),
        //     validateCoordinateValue(components[3]),
        //     validateCoordinateValue(components[4])
        // ].every(Boolean);
        return true;
    }
}
