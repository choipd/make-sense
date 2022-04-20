import {IRect} from '../../interfaces/IRect';
import {Action} from '../Actions';
import {LabelType, LabelModeType} from '../../data/enums/LabelType';
import {IPoint} from '../../interfaces/IPoint';
import {LabelStatus} from '../../data/enums/LabelStatus';
import {ILine} from '../../interfaces/ILine';
import {GENDER} from '../../data/enums/ItemType';

export type LabelRect = {
    // GENERAL
    id: string;
    labelId: string;
    rect: IRect;

    // Custom by mj
    mode?: LabelModeType;

    // AI
    isCreatedByAI: boolean;
    status: LabelStatus;
    suggestedLabel: string;
};

export type LabelPoint = {
    // GENERAL
    id: string;
    labelId: string;
    point: IPoint;

    // AI
    isCreatedByAI: boolean;
    status: LabelStatus;
    suggestedLabel: string;
};

export type LabelPolygon = {
    id: string;
    labelId: string;
    vertices: IPoint[];
};

export type LabelLine = {
    id: string;
    labelId: string;
    line: ILine;
};

export type LabelName = {
    name: string;
    id: string;
    color: string;
};

export type HumanInfo = {
    uuid: string;
    id: number;
    gender: number;
    type: number;
    styles: string[];
};

export type ItemInfo = {
    uuid: string;
    id: number;
    humanId: string;
    gender: number;
    mainCategory: number;
    subCategory: number;
    color: number;
    pattern: number;
    styles: string[];
};

export type ImageData = {
    id: string;
    fileData: File;
    loadStatus: boolean;
    labelRects: LabelRect[];
    labelPoints: LabelPoint[];
    labelLines: LabelLine[];
    labelPolygons: LabelPolygon[];
    labelNameIds: string[];
    humans: HumanInfo[];
    items: ItemInfo[];

    // SSD
    isVisitedByObjectDetector: boolean;

    // POSE NET
    isVisitedByPoseDetector: boolean;
};

export type RectJSON = {
    img_path: string;
    writer_id: string;
    version: number;
    human_info: {
        human_id: string;
        bounding_box: {
            lt_x: number;
            lt_y: number;
            rb_x: number;
            rb_y: number;
        };
        style: string[];
    }[];
    item_info: {
        item_id: string;
        bounding_box: {
            lt_x: number;
            lt_y: number;
            rb_x: number;
            rb_y: number;
        };
        style: string[];
    }[];
};

export type LabelsState = {
    activeImageIndex: number;
    activeLabelNameId: string;
    activeLabelType: LabelType;
    activeLabelId: string;
    highlightedLabelId: string;
    imagesData: ImageData[];
    firstLabelCreatedFlag: boolean;
    labels: LabelName[];
    activeLabelMode: LabelModeType;
    activeGender: number;
    activeHumanType: number;
    activeStyles?: string[];
    activeHumanID?: string;
    activeMainCategory?: number;
    activeSubCategory?: number;
    activeColor?: number;
    activePattern?: number;
};

interface UpdateActiveImageIndex {
    type: typeof Action.UPDATE_ACTIVE_IMAGE_INDEX;
    payload: {
        activeImageIndex: number;
    };
}

interface UpdateActiveLabelNameId {
    type: typeof Action.UPDATE_ACTIVE_LABEL_NAME_ID;
    payload: {
        activeLabelNameId: string;
    };
}

interface UpdateActiveLabelId {
    type: typeof Action.UPDATE_ACTIVE_LABEL_ID;
    payload: {
        activeLabelId: string;
    };
}

interface UpdateHighlightedLabelId {
    type: typeof Action.UPDATE_HIGHLIGHTED_LABEL_ID;
    payload: {
        highlightedLabelId: string;
    };
}

interface UpdateActiveLabelType {
    type: typeof Action.UPDATE_ACTIVE_LABEL_TYPE;
    payload: {
        activeLabelType: LabelType;
    };
}

interface UpdateImageDataById {
    type: typeof Action.UPDATE_IMAGE_DATA_BY_ID;
    payload: {
        id: string;
        newImageData: ImageData;
    };
}

interface AddImageData {
    type: typeof Action.ADD_IMAGES_DATA;
    payload: {
        imageData: ImageData[];
    };
}

interface UpdateImageData {
    type: typeof Action.UPDATE_IMAGES_DATA;
    payload: {
        imageData: ImageData[];
    };
}

interface UpdateLabelNames {
    type: typeof Action.UPDATE_LABEL_NAMES;
    payload: {
        labels: LabelName[];
    };
}

interface UpdateFirstLabelCreatedFlag {
    type: typeof Action.UPDATE_FIRST_LABEL_CREATED_FLAG;
    payload: {
        firstLabelCreatedFlag: boolean;
    };
}

interface UpdateActiveLabelMode {
    type: typeof Action.UPDATE_ACTIVE_LABEL_MODE;
    payload: {
        mode: LabelModeType;
    };
}

interface UpdateActiveGender {
    type: typeof Action.UPDATE_ACTIVE_GENDER;
    payload: {
        gender: number;
    };
}

interface UpdateActiveHumanType {
    type: typeof Action.UPDATE_ACTIVE_HUMAN_TYPE;
    payload: {
        humanType: number;
    };
}

interface UpdateActiveStyles {
    type: typeof Action.UPDATE_ACTIVE_STYLES;
    payload: {
        styles: string[];
    };
}

interface UpdateActiveHumanID {
    type: typeof Action.UPDATE_ACTIVE_HUMAN_ID;
    payload: {
        humanId: string;
    };
}

interface UpdateActiveMainCategory {
    type: typeof Action.UPDATE_ACTIVE_MAIN_CATEGORY;
    payload: {
        mainCategory: number;
    };
}

interface UpdateActiveSubCategory {
    type: typeof Action.UPDATE_ACTIVE_SUB_CATEGORY;
    payload: {
        subCategory: number;
    };
}

interface UpdateActiveColor {
    type: typeof Action.UPDATE_ACTIVE_COLOR;
    payload: {
        color: number;
    };
}

interface UpdateActivePattern {
    type: typeof Action.UPDATE_ACTIVE_PATTERN;
    payload: {
        pattern: number;
    };
}

export type LabelsActionTypes =
    | UpdateActiveImageIndex
    | UpdateActiveLabelNameId
    | UpdateActiveLabelType
    | UpdateImageDataById
    | AddImageData
    | UpdateImageData
    | UpdateLabelNames
    | UpdateActiveLabelId
    | UpdateHighlightedLabelId
    | UpdateFirstLabelCreatedFlag
    | UpdateActiveLabelMode
    | UpdateActiveGender
    | UpdateActiveHumanType
    | UpdateActiveStyles
    | UpdateActiveHumanID
    | UpdateActiveMainCategory
    | UpdateActiveSubCategory
    | UpdateActiveColor
    | UpdateActivePattern;
