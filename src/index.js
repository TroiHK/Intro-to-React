import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    render() {
        return (
            <button className={"square" + this.props.customClass}
                    onClick={() => this.props.onClick()}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(i) {
        let highlightClass = this.props.winnerPositions.indexOf(i) > -1 ? ' highlight' : '';
        let activeClass = this.props.selectedItem === i ? ' active' : '';
        return (
            <Square
                key={i}
                customClass={highlightClass + activeClass}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <Repeat numTimes="3">
                {(index) => <Repeat key={index} numTimes="3" classWrap="board-row">{(indexLv2) => this.renderSquare(indexLv2+index*3)}</Repeat>}
            </Repeat>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: Array(2).fill(null),
                selectedItem: null,
                step: 0,
            }],
            stepNumber: 0,
            xIsNext: true,
            orderASC: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const { winner } = calculateWinner(squares)

        if ( winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: getLocation(i),
                selectedItem: i,
                step: current.step + 1,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    orderMoves() {
        this.setState({
            orderASC: !this.state.orderASC,
        });
    }

    render() {
        const history = this.state.history;
        const orderASC = this.state.orderASC;
        const current = history[this.state.stepNumber];
        const { winner, positions } = calculateWinner(current.squares);

        const cpHistory = this.state.history.slice();
        const orderHistory = orderASC ? cpHistory : cpHistory.reverse();
        let orderText = orderASC ? 'DESC' : 'ASC';

        const moves = orderHistory.map((item, move) => {
            const desc = item.step ?
                'Go to move #' + item.step :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(item.step)}>{desc}</button>
                </li>
            );
        });

        let status;
        if ( winner ) {
            status = 'Winner: ' + winner;
        } else {
            if ( history.length >= 10 ) {
                status = 'No Winner';
            } else {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }

        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        selectedItem={current.selectedItem}
                        winnerPositions={positions}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{ moves }</ol>
                    <button onClick={() => this.orderMoves()}>{orderText}</button>
                </div>
            </div>
        );
    }
}

function getLocation(l) {
    let location = Array(2).fill(null);
    location[0] = l < 3 ? 1: l > 5 ? 3 : 2;
    location[1] = l % 3 === 0 ? 1 : (l - 2) % 3 === 0 ? 3 : 2;
    return location;
}

function calculateWinner(squares) {
    const results = {
        winner: null,
        positions: Array(3).fill(null),
    };
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            results.winner = squares[a];
            results.positions[0] = a;
            results.positions[1] = b;
            results.positions[2] = c;
        }
    }
    return results;
}

function Repeat(props) {
    let items = [];
    for (let i = 0; i < props.numTimes; i++) {
        items.push(props.children(i));
    }
    return <div className={props.classWrap ? props.classWrap : ""}>{items}</div>;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
