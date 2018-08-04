import React from 'react';
import '../style/style.css';

let interval = null;

class CountDown extends React.Component {

    constructor(props) {
        
        super(props);

        this.state = {
            now: Math.trunc((new Date()).getTime() / 1000),
            date: null,
            diff: 0
        }

        this.seconds = this.seconds.bind(this);
        this.minutes = this.minutes.bind(this);
        this.hours = this.hours.bind(this);
        this.days = this.days.bind(this);
        this.setDateAndInterVal = this.setDateAndInterVal.bind(this)
    }
    
    /**
     * Set Initial Date and Interval
     * For this.state.now 
     */
    setDateAndInterVal() {
        let promise = new Promise((resolve, rejects) => {
            if (!this.props.deadline && !this.props.end) {
                rejects(Error("Missing props 'deadline' or 'end'"));
            }
            let endTime = this.props.deadline ? this.props.deadline : this.props.end;
            resolve(endTime);
        })
        
        
        promise.then((endTime) => {
            this.setState({
                date: Math.trunc(Date.parse(endTime.replace(/-/g, "/")) / 1000)
            });

            if (!this.state.date) {
                throw new Error("Invalid props value, correct the 'deadline' or 'end'");
            }

            interval = setInterval(() => {
                this.setState({
                    now : Math.trunc((new Date()).getTime() / 1000)
                }); 
            }, 1000);

        })
        .catch((err) => {
            throw new Error(err)
        })
    }

    componentWillMount() {
        this.setDateAndInterVal()
    }

    componentWillUnmount() {
        clearInterval(interval);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.now !== this.state.now) {
            let diff = this.state.date - this.state.now;
            this.setDiff(diff); // set diff 
        }
    }

    setDiff(diff) {
        let promise = new Promise((resolve, reject) => {
            if (diff <= 0 || this.props.stop) {
                this.setState({
                    diff: 0
                })
                // Remove interval
                clearInterval(interval);

                reject();
            }

            if (diff > 0) {
                resolve(diff);
            }
        })

        promise.then( result => {
            this.setState({
                diff: result
            })
        })
        .catch((err) => {
            throw new Error(err)
        })
    }

    // set two digits
    twoDigits(value) {
        if ( value.toString().length <= 1 ) {
            return '0'+value.toString()
        }
        return value.toString()
    }

    // update seconds
    seconds() {
        return Math.trunc(this.state.diff) % 60
    }

    // update minutes
    minutes() {
        return Math.trunc(this.state.diff / 60) % 60
    }

    // update hours
    hours() {
        return Math.trunc(this.state.diff / 60 / 60) % 24
    }

    // update days
    days() {
        return Math.trunc(this.state.diff / 60 / 60 / 24)
    }

    // update show days
    showDays() {
        if (this.days() > 0) {
            return (
                <li>
                    <p className="digit">{ this.days() | this.twoDigits(this.days()) }</p>
                    <p className="text">{ this.days() > 1 ? 'days' : 'day' }</p>
                </li>
            );
        }
    }

    render() {
        return(
            <div>
                <ul className="react-countdown">
                    { this.showDays() }
                    <li>
                        <p className="digit">{ this.hours() | this.twoDigits(this.hours()) }</p>
                        <p className="text">{ this.hours() > 1 ? 'hours' : 'hour' }</p>
                    </li>
                    <li>
                        <p className="digit">{ this.minutes() | this.twoDigits(this.minutes()) }</p>
                        <p className="text">min</p>
                    </li>
                    <li>
                        <p className="digit">{ this.seconds() | this.twoDigits(this.seconds()) }</p>
                        <p className="text">Sec</p>
                    </li>
                </ul>
            </div>
        );
    }

}

CountDown.propTypes = {
    deadline: React.PropTypes.string,
    end: React.PropTypes.string,
    stop: React.PropTypes.bool
}

CountDown.defaultProps = {
    deadline: '',
    end: '',
    stop: false
}

export default CountDown;