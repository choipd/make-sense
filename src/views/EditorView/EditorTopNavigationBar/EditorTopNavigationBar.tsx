import {ContextType} from '../../../data/enums/ContextType';
import './EditorTopNavigationBar.scss';
import React from 'react';
import classNames from 'classnames';
import {AppState} from '../../../store';
import {connect} from 'react-redux';
import {
    updateCrossHairVisibleStatus,
    updateFillMode,
    updateImageDragModeStatus
} from '../../../store/general/actionCreators';
import {GeneralSelector} from '../../../store/selectors/GeneralSelector';
import {ViewPointSettings} from '../../../settings/ViewPointSettings';
import {ImageButton} from '../../Common/ImageButton/ImageButton';
import {ViewPortActions} from '../../../logic/actions/ViewPortActions';
import {LabelsSelector} from '../../../store/selectors/LabelsSelector';
import {LabelType} from '../../../data/enums/LabelType';
import {AISelector} from '../../../store/selectors/AISelector';
import {ISize} from '../../../interfaces/ISize';
import {AIActions} from '../../../logic/actions/AIActions';
import withStyles from '@material-ui/core/styles/withStyles';
import {Tooltip} from '@material-ui/core';
import Fade from '@material-ui/core/Fade';

const BUTTON_SIZE: ISize = {width: 30, height: 30};
const BUTTON_PADDING: number = 10;

const StyledTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: '#171717',
        color: '#ffffff',
        boxShadow: theme.shadows[1],
        fontSize: 12,
        maxWidth: 200,
        textAlign: 'center'
    }
}))(Tooltip);

const getButtonWithTooltip = (
    key: string,
    tooltipMessage: string,
    imageSrc: string,
    imageAlt: string,
    isActive: boolean,
    href?: string,
    onClick?: () => any
): React.ReactElement => {
    return (
        <StyledTooltip
            key={key}
            disableFocusListener={true}
            title={tooltipMessage}
            TransitionComponent={Fade}
            TransitionProps={{timeout: 600}}
            placement="bottom">
            <div>
                <ImageButton
                    buttonSize={BUTTON_SIZE}
                    padding={BUTTON_PADDING}
                    image={imageSrc}
                    imageAlt={imageAlt}
                    href={href}
                    onClick={onClick}
                    isActive={isActive}
                />
            </div>
        </StyledTooltip>
    );
};

interface IProps {
    activeContext: ContextType;
    updateImageDragModeStatusAction: (imageDragMode: boolean) => any;
    updateCrossHairVisibleStatusAction: (crossHairVisible: boolean) => any;
    updateFillModeAction: (fillMode: boolean) => any;
    imageDragMode: boolean;
    crossHairVisible: boolean;
    fillMode: boolean;
    activeLabelType: LabelType;
}

const EditorTopNavigationBar: React.FC<IProps> = ({
    activeContext,
    updateImageDragModeStatusAction,
    updateCrossHairVisibleStatusAction,
    updateFillModeAction,
    imageDragMode,
    crossHairVisible,
    fillMode,
    activeLabelType
}) => {
    const getClassName = () => {
        return classNames('EditorTopNavigationBar', {
            'with-context': activeContext === ContextType.EDITOR
        });
    };

    const imageDragOnClick = () => {
        if (imageDragMode) {
            updateImageDragModeStatusAction(!imageDragMode);
        } else if (GeneralSelector.getZoom() !== ViewPointSettings.MIN_ZOOM) {
            updateImageDragModeStatusAction(!imageDragMode);
        }
    };

    const crossHairOnClick = () => {
        updateCrossHairVisibleStatusAction(!crossHairVisible);
    };

    const fillOnClick = () => {
        updateFillModeAction(!fillMode);
    };

    return (
        <div className={getClassName()}>
            <div className="ButtonWrapper">
                {getButtonWithTooltip(
                    'zoom-in',
                    'zoom in',
                    'ico/zoom-in.png',
                    'zoom-in',
                    false,
                    undefined,
                    () => ViewPortActions.zoomIn()
                )}
                {getButtonWithTooltip(
                    'zoom-out',
                    'zoom out',
                    'ico/zoom-out.png',
                    'zoom-out',
                    false,
                    undefined,
                    () => ViewPortActions.zoomOut()
                )}
                {getButtonWithTooltip(
                    'zoom-fit',
                    'fit image to available space',
                    'ico/zoom-fit.png',
                    'zoom-fit',
                    false,
                    undefined,
                    () => ViewPortActions.setDefaultZoom()
                )}
                {getButtonWithTooltip(
                    'zoom-max',
                    'maximum allowed image zoom',
                    'ico/zoom-max.png',
                    'zoom-max',
                    false,
                    undefined,
                    () => ViewPortActions.setOneForOneZoom()
                )}
            </div>
            <div className="ButtonWrapper">
                {getButtonWithTooltip(
                    'image-drag-mode',
                    imageDragMode
                        ? 'turn-off image drag mode'
                        : 'turn-on image drag mode - works only when image is zoomed',
                    'ico/hand.png',
                    'image-drag-mode',
                    imageDragMode,
                    undefined,
                    imageDragOnClick
                )}
                {getButtonWithTooltip(
                    'cursor-cross-hair',
                    crossHairVisible
                        ? 'turn-off cursor cross-hair'
                        : 'turn-on cursor cross-hair',
                    'ico/cross-hair.png',
                    'cross-hair',
                    crossHairVisible,
                    undefined,
                    crossHairOnClick
                )}
                {getButtonWithTooltip(
                    'fill-off',
                    fillMode ? 'fill-off' : 'fill-on',
                    'ico/outline-off.png',
                    'outline-off',
                    !fillMode,
                    undefined,
                    fillOnClick
                )}
            </div>
            {((activeLabelType === LabelType.RECT &&
                AISelector.isAIObjectDetectorModelLoaded()) ||
                (activeLabelType === LabelType.POINT &&
                    AISelector.isAIPoseDetectorModelLoaded())) && (
                <div className="ButtonWrapper">
                    {getButtonWithTooltip(
                        'accept-all',
                        'accept all proposed detections',
                        'ico/accept-all.png',
                        'accept-all',
                        false,
                        undefined,
                        () =>
                            AIActions.acceptAllSuggestedLabels(
                                LabelsSelector.getActiveImageData()
                            )
                    )}
                    {getButtonWithTooltip(
                        'reject-all',
                        'reject all proposed detections',
                        'ico/reject-all.png',
                        'reject-all',
                        false,
                        undefined,
                        () =>
                            AIActions.rejectAllSuggestedLabels(
                                LabelsSelector.getActiveImageData()
                            )
                    )}
                </div>
            )}
        </div>
    );
};

const mapDispatchToProps = {
    updateImageDragModeStatusAction: updateImageDragModeStatus,
    updateCrossHairVisibleStatusAction: updateCrossHairVisibleStatus,
    updateFillModeAction: updateFillMode
};

const mapStateToProps = (state: AppState) => ({
    activeContext: state.general.activeContext,
    imageDragMode: state.general.imageDragMode,
    crossHairVisible: state.general.crossHairVisible,
    fillMode: state.general.fillMode,
    activeLabelType: state.labels.activeLabelType
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditorTopNavigationBar);
