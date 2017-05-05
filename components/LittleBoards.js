// Include React
var React = require("react");
var axios = require('axios');

class LittleBoards extends React.Component {
    
    constructor(props) {
        super(props);
				this.state = {
					records: []
				};
    }

    getData() {
        axios.get('leaderboard')
					.then((res) => {
						this.setState({records: res.data})
					}).catch(function(error) {
						console.log(error);
					})
    }

    componentWillMount() {
      this.getData();
    }

		dynamicClasses(color, border, align) {
			
			if (align) {
				align = 'middle';
			} else {
				align = 'left';
			}
			
			return (color + " " + border + " " + align);
		}

		renderRecords() {
			return this.state.records.map((record, i, align) => {
				var color;
				var border;
				var align;

				if ((i+1)%2 == 0) {
					color = 'text-blue';
					border =  'outline-dark-blue';
				}
				if ((i+1)%2 != 0) {
					color = 'text-orange'
					border = 'outline-dark-orange';
				}
				return(
					<tr
						key={record.id}
						className='record littleboard-user'>
						<td className={this.dynamicClasses(color, border, align)} >{i+1}</td>
						<td className={this.dynamicClasses(color, border)}>{record.User.name}</td>
						<td className={this.dynamicClasses(color, border, align)}>{record.wins}</td>
						<td className={this.dynamicClasses(color, border, align)}>{record.losses}</td>
						{/*<td>{record.disconnects}</td>*/}
					</tr>
				)
				
			});
		}

    render() {
      return (
        <div className='littleboard container center-align'>
					<table className='littlerboard-table'>
						<tbody>
							<tr>
								<th className='littleboard-header'>Place</th>
								<th className='littleboard-header'>User Name</th>
								<th className='littleboard-header'>Wins</th>
								<th className='littleboard-header'>Losses</th>
								{/*<th>disconnects</th>*/}
							</tr>
							{this.renderRecords()}
						</tbody>
					</table>
				</div>
        );
    }
};

module.exports = LittleBoards;
