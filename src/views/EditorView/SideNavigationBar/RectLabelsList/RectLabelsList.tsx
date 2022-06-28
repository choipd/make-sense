import React from 'react';
import {ISize} from '../../../../interfaces/ISize';
import Scrollbars from 'react-custom-scrollbars';
import {ImageData, LabelName, LabelRect} from '../../../../store/labels/types';
import './RectLabelsList.scss';
import {
    updateActiveLabelId,
    updateActiveLabelNameId,
    updateImageDataById
} from '../../../../store/labels/actionCreators';
import {AppState} from '../../../../store';
import {connect} from 'react-redux';
import LabelInputField from '../LabelInputField/LabelInputField';
import EmptyLabelList from '../EmptyLabelList/EmptyLabelList';
import {LabelActions} from '../../../../logic/actions/LabelActions';
import {LabelStatus} from '../../../../data/enums/LabelStatus';
import {findLast} from 'lodash';
import {updateActivePopupType} from '../../../../store/general/actionCreators';
import {PopupWindowType} from '../../../../data/enums/PopupWindowType';
import {LabelModeType} from '../../../../data/enums/LabelType';
import _ from 'lodash';
import {vi as lang} from '../../../../lang';
import {
    GENDER,
    GENDER_CODE,
    ITEM_COLOR,
    ITEM_PATTERN,
    MAIN_CATEGORY_CODE,
    SOURCE,
    SOURCE_CODE,
    SUB_CATEGORY_CODE
} from '../../../../data/enums/ItemType';
import {Settings} from '../../../../settings/Settings';

interface IProps {
    size: ISize;
    imageData: ImageData;
    updateImageDataById: (id: string, newImageData: ImageData) => any;
    activeLabelId: string;
    highlightedLabelId: string;
    updateActiveLabelNameId: (activeLabelId: string) => any;
    labelNames: LabelName[];
    updateActiveLabelId: (activeLabelId: string) => any;
    updateActivePopupTypeAction: (popupType: PopupWindowType) => any;
}

const RectLabelsList: React.FC<IProps> = ({
    size,
    imageData,
    updateImageDataById,
    labelNames,
    updateActiveLabelNameId,
    activeLabelId,
    highlightedLabelId,
    updateActiveLabelId,
    updateActivePopupTypeAction
}) => {
    const labelInputFieldHeight = 40;
    const listStyle: React.CSSProperties = {
        width: size.width,
        height: size.height
    };
    const listStyleContent: React.CSSProperties = {
        width: size.width,
        height: imageData.labelRects.length * labelInputFieldHeight
    };

    const deleteRectLabelById = (labelRectId: string) => {
        LabelActions.deleteRectLabelById(imageData.id, labelRectId);
    };

    const updateRectLabel = (labelRectId: string, labelNameId: string) => {
        const newImageData = {
            ...imageData,
            labelRects: imageData.labelRects.map((labelRect: LabelRect) => {
                if (labelRect.id === labelRectId) {
                    return {
                        ...labelRect,
                        labelId: labelNameId,
                        status: LabelStatus.ACCEPTED
                    };
                } else {
                    return labelRect;
                }
            })
        };
        updateImageDataById(imageData.id, newImageData);
        updateActiveLabelNameId(labelNameId);
    };

    const showInfo = (labelRectId: string) => {
        updateActiveLabelId(labelRectId);
        updateActivePopupTypeAction(PopupWindowType.LABEL_INFO);
    };

    const onClickHandler = () => {
        updateActiveLabelId(null);
    };

    const getDescription = (labelRect: LabelRect) => {
        if (labelRect.mode === LabelModeType.HUMAN) {
            const found = _.find(imageData.humans, {uuid: labelRect.id});
            if (found) {
                return `${found.styles
                    .map(
                        (style) => lang.FASHION_STYLE[style.toLocaleLowerCase()]
                    )
                    .join('_')}_${lang.GENDER[GENDER_CODE[found.gender]]}`;
            }
        } else {
            const found = _.find(imageData.items, {uuid: labelRect.id});
            if (found) {
                console.log('found.gender', found.gender);
                return `${found.styles
                    .map(
                        (style) => lang.FASHION_STYLE[style.toLocaleLowerCase()]
                    )
                    .filter((style) => style !== undefined)
                    .join('_')}_${lang.GENDER[GENDER_CODE[found.gender]]}_${
                    lang.MAIN_CATEGORY[MAIN_CATEGORY_CODE[found.mainCategory]]
                }_${lang.SUB_CATEGORY[SUB_CATEGORY_CODE[found.subCategory]]}_${
                    lang.ITEM_COLOR[ITEM_COLOR[found.color]]
                }_${lang.ITEM_PATTERN[ITEM_PATTERN[found.pattern]]}
                `;
            }
        }
        return '';
    };

    const getDescriptionIcon = (labelRect: LabelRect) => {
        if (labelRect.mode === LabelModeType.HUMAN) {
            const found = _.find(imageData.humans, {uuid: labelRect.id});
            if (found) {
                return (
                    <div className="ItemContainer">
                        <span className="Item">
                            {found.styles
                                .map(
                                    (style) =>
                                        lang.FASHION_STYLE[
                                            style.toLocaleLowerCase()
                                        ]
                                )
                                .filter((style) => style !== undefined)
                                .join('_')}
                        </span>
                        <img
                            className="ItemIcon"
                            src={
                                found.gender === GENDER.UNKNOWN
                                    ? Settings.UNKNOWN_URL
                                    : `guides/icons/genders/${found.gender}_s.png`
                            }
                            alt={`${lang.GENDER[GENDER_CODE[found.gender]]} (${
                                GENDER_CODE[found.gender]
                            })`}
                        />
                        <img
                            className="ItemIcon"
                            src={
                                found.type === SOURCE.UNKNOWN
                                    ? Settings.UNKNOWN_URL
                                    : `guides/icons/sources/${found.type}_s.png`
                            }
                            alt={`${lang.SOURCE[SOURCE_CODE[found.type]]} (${
                                SOURCE_CODE[found.type]
                            })`}
                        />
                    </div>
                );
            }
        } else {
            const found = _.find(imageData.items, {uuid: labelRect.id});
            if (found) {
                return (
                    <div className="ItemContainer">
                        <span className="Item">
                            {found.styles
                                .map(
                                    (style) =>
                                        lang.FASHION_STYLE[
                                            style.toLocaleLowerCase()
                                        ]
                                )
                                .filter((style) => style !== undefined)
                                .join('_')}
                        </span>
                        <img
                            className="ItemIcon"
                            src={
                                found.gender === GENDER.UNKNOWN
                                    ? Settings.UNKNOWN_URL
                                    : `guides/icons/genders/${found.gender}_s.png`
                            }
                            alt={`${lang.GENDER[GENDER_CODE[found.gender]]} (${
                                GENDER_CODE[found.gender]
                            })`}
                        />
                        <img
                            className="ItemIcon"
                            src={
                                found.mainCategory ===
                                MAIN_CATEGORY_CODE.UNKNOWN
                                    ? Settings.UNKNOWN_URL
                                    : `guides/icons/main_cats/${found.mainCategory}_s.png`
                            }
                            alt={`${
                                lang.MAIN_CATEGORY[
                                    MAIN_CATEGORY_CODE[found.mainCategory]
                                ]
                            } (${MAIN_CATEGORY_CODE[found.mainCategory]})`}
                        />
                        <img
                            className="ItemIcon"
                            src={
                                found.subCategory === SUB_CATEGORY_CODE.UNKNOWN
                                    ? Settings.UNKNOWN_URL
                                    : `guides/icons/sub_cats/${found.subCategory}_s.png`
                            }
                            alt={`${
                                lang.SUB_CATEGORY[
                                    SUB_CATEGORY_CODE[found.subCategory]
                                ]
                            } (${SUB_CATEGORY_CODE[found.subCategory]})`}
                        />

                        <img
                            className="ItemIcon"
                            src={
                                found.color === ITEM_COLOR.UNKNOWN
                                    ? Settings.UNKNOWN_URL
                                    : `guides/icons/colors/${found.color}_s.png`
                            }
                            alt={`${
                                lang.ITEM_COLOR[ITEM_COLOR[found.color]]
                            } (${ITEM_COLOR[found.color]})`}
                        />
                        <img
                            className="ItemIcon"
                            src={
                                found.pattern === ITEM_COLOR.UNKNOWN
                                    ? Settings.UNKNOWN_URL
                                    : `guides/icons/patterns/${found.pattern}_s.png`
                            }
                            alt={`${
                                lang.ITEM_PATTERN[ITEM_PATTERN[found.pattern]]
                            } (${ITEM_PATTERN[found.pattern]})`}
                        />
                    </div>
                );
            }
        }
        return null;
    };

    const getChildren = () => {
        return imageData.labelRects
            .filter(
                (labelRect: LabelRect) =>
                    labelRect.status === LabelStatus.ACCEPTED
            )
            .map((labelRect: LabelRect) => {
                return (
                    <LabelInputField
                        size={{
                            width: size.width,
                            height: labelInputFieldHeight
                        }}
                        isActive={labelRect.id === activeLabelId}
                        isHighlighted={labelRect.id === highlightedLabelId}
                        mode={labelRect.mode}
                        id={labelRect.id}
                        key={labelRect.id}
                        onDelete={deleteRectLabelById}
                        value={
                            labelRect.labelId !== null
                                ? findLast(labelNames, {id: labelRect.labelId})
                                : null
                        }
                        options={labelNames}
                        onSelectLabel={updateRectLabel}
                        onSelectInfo={showInfo}
                        description={getDescription(labelRect)}
                    />
                );
            });
    };

    return (
        <div
            className="RectLabelsList"
            style={listStyle}
            onClickCapture={onClickHandler}>
            {imageData.labelRects.filter(
                (labelRect: LabelRect) =>
                    labelRect.status === LabelStatus.ACCEPTED
            ).length === 0 ? (
                <EmptyLabelList
                    labelBefore={'draw your first bounding box'}
                    labelAfter={'no labels created for this image yet'}
                />
            ) : (
                <Scrollbars>
                    <div
                        className="RectLabelsListContent"
                        style={listStyleContent}>
                        {getChildren()}
                    </div>
                </Scrollbars>
            )}
        </div>
    );
};

const mapDispatchToProps = {
    updateImageDataById,
    updateActiveLabelNameId,
    updateActiveLabelId,
    updateActivePopupTypeAction: updateActivePopupType
};

const mapStateToProps = (state: AppState) => ({
    activeLabelId: state.labels.activeLabelId,
    activeLabelMode: state.labels.activeLabelMode,
    highlightedLabelId: state.labels.highlightedLabelId,
    labelNames: state.labels.labels
});

export default connect(mapStateToProps, mapDispatchToProps)(RectLabelsList);
