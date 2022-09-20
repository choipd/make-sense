import * as React from 'react';
import {connect} from 'react-redux';
import {APIService} from 'services/API';
import {AppState} from 'store';
import {updateTaskStatus} from 'store/performance/actionCreators';
import {TaskStatus} from 'store/performance/types';
import './PerformanceProgress.scss';
import arrowDownLeft from './images/arrow-down-left.png';
import classNames from 'classnames';

interface IProps {
    taskStatus: TaskStatus;
    updateTaskStatusAction: (taskStatus: TaskStatus) => any;
}

const PerformanceProgress: React.FC<IProps> = ({
    taskStatus,
    updateTaskStatusAction
}) => {
    React.useEffect(() => {
        const loadData = async () => {
            const {data} = await APIService.getTaskStatus();
            updateTaskStatusAction(data.data);
        };
        loadData();
    }, []);

    const {averageTPD, currentAverageTPD, me, highestRanker} = taskStatus;

    const getPercent = (value: number, margin: number = 0) =>
        `calc(${Math.min(value / averageTPD, 1) * 100}% - ${margin}px`;

    const getPercentInverse = (value: number, margin: number = 0) =>
        `calc(${100 - Math.min(value / averageTPD, 1) * 100}% + ${margin}px`;

    const overHalf = (value: number) =>
        Math.min(value / averageTPD, 1) * 100 > 50;

    const cropPercent = (value: number, crop: number = 25) => {
        const progress = Math.min(value / averageTPD, 1) * 100;
        return progress < crop || progress > 100 - crop;
    };

    return (
        <div className="PerformanceProgress">
            <div className="Progress">
                <div
                    className="Filler"
                    style={{
                        width: getPercent(currentAverageTPD)
                    }}>
                    {cropPercent(currentAverageTPD, 10) ? null : (
                        <span className="AverageLabel">average speed</span>
                    )}
                </div>
                <div
                    className="Ranker"
                    style={{
                        left: getPercent(highestRanker.tpd, 10)
                    }}
                />
                <div
                    className="Me"
                    style={{
                        left: getPercent(me.tpd, 10)
                    }}
                />
            </div>
            <div
                className={classNames({Name: true, Reverse: overHalf(me.tpd)})}
                style={
                    overHalf(me.tpd)
                        ? {right: getPercentInverse(me.tpd, 4)}
                        : {left: getPercent(me.tpd, 10)}
                }>
                <img
                    src={arrowDownLeft}
                    className={classNames({FlipV: overHalf(me.tpd)})}
                    style={{width: 10, height: 10, marginLeft: 2, marginTop: 4}}
                />
                <span>{me.displayName}</span>
            </div>
        </div>
    );
};

const mapDispatchToProps = {
    updateTaskStatusAction: updateTaskStatus
};

const mapStateToProps = (state: AppState) => ({
    taskStatus: state.performance.taskStatus
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PerformanceProgress);
