function setNavigationTeams() {

	Select('#main', {
		innerHTML: '',
		children: [
			Create('div', {
				className: 'block',
				style: {
					height: '100%'
				},
				children: [
					Create('div', {
						className: 'row',
						children: [
							Create('div', {
								className: 'col',
								style: {
									width: '30%',
									height: '100%'
								},
								children: [
									Create('div', {
										className: 'row',
										children: [
											Create('div', {
												className: 'col',
												style: {
													width: '50%'
												},
												children: [
													Create('h3', {
														innerHTML: 'Team Management'
													})
												]
											}),
											Create('div', {
												className: 'col',
												style: {
													width: '50%',
													textAlign: 'right'
												},
												children: [
													Create('button', {
														innerHTML: 'Create Team',
														onclick: () => { setupTeamEditor(); },
														style: {
															position: 'relative',
															top: '10px'
														}
													})
												]
											})
										]
									}),
									Create('input', {
										type: 'text',
										placeholder: 'Search...'
									}),
									Create('div', {
										id: 'team_list',
										style: {
											height: 'calc(100% - 150px)',
											overflowY: 'scroll'
										}
									})
								]
							}),
							Create('div', {
								className: 'col',
								id: 'team_management_form_block',
								style: {
									width: '70%',
									height: '100%',
									overflowY: 'scroll'
								}
							})
						]
					})
				]
			})
		]
	});
	
	// setup team editor, default to create
	setupTeamEditor(null);
	
	// setup team selection list
	generateTeamSelectionList();
		
}

function updateTeamData() {
	
	// use form style capture to easily inherit form capture methods
	let form_details = formToObj('team_creation_form');
	
	// append application
	form_details.application = 'update_team';
	
	// append tournament uid
	form_details.tournament_uid = GLOBAL.active_tournament.uid;
	
	// update server-side team details, then call back to same scope function to save changes locally
	ajax('POST', '/requestor.php', form_details, (status, data) => {
		
		if (status) {
			
			// update / insert new team locally
			GLOBAL.active_tournament.data.sets.teams.entries[data.msg.uid] = data.msg;
			
			// load team data into form
			loadTeamData(data.msg.uid);
			
			// re-create team selection list
			generateTeamSelectionList();
			
		}
		
	}, 'team_management_form_block');
}

function removeTeam(team) {
	
	let form_details = {
		tournament_uid: GLOBAL.active_tournament.uid,
		team_uid: team.uid,
		application: 'remove_team'
	};
	
	// remove team server side
	ajax('POST', '/requestor.php', form_details, (status, data) => {
		
		if (status) {
			
			// delete local team
			delete GLOBAL.active_tournament.data.sets.teams.entries[team.uid];
			
			// bring up create team form
			loadTeamData();
			
			// re-create team selection list
			generateTeamSelectionList();
			
		}
		
	}, 'team_management_form_block');
}

function loadTeamData(uid) {
	setupTeamEditor(GLOBAL.active_tournament.data.sets.teams.entries[uid]);
}

function setupTeamEditor(team_data = null) {
	Select('#team_management_form_block', {
		innerHTML: '',
		children: [
			Create('h3', {
				innerHTML: (team_data == null ? 'Create New Team' : 'Update Team')
			}),
			Create('form', {
				id: 'team_creation_form',
				children: [
					Create('input', {
						type: 'hidden',
						name: 'team_manager_type',
						value: team_data == null ? 'create' : team_data.uid
					}),
					Create('label', {
						innerHTML: 'Team Name',
						children: [
							Create('input', {
								type: 'text',
								name: 'team_name',
								value: team_data == null ? '' : team_data.display
							})
						]
					}),
					Create('label', {
						innerHTML: 'Primary Color',
						children: [
							Create('input', {
								type: 'color',
								name: 'team_primary_color',
								value: team_data == null ? '#000000' : team_data.primary_color
							})
						]
					}),
					Create('label', {
						innerHTML: 'Secondary Color',
						children: [
							Create('input', {
								type: 'color',
								name: 'team_secondary_color',
								value: team_data == null ? '#ffffff' : team_data.secondary_color
							})
						]
					}),
					Create('h4', {
						innerHTML: 'Roster'
					}),
					...new Array(GLOBAL.active_tournament.settings.team_size).fill(null).map((v, index) => {
						return Create('input', {
							type: 'text',
							name: 'team_roster[]',
							value: team_data == null ? '' : (team_data.roster[index] ?? '')
						});
					}),
					(team_data == null
						? Create('div')
						: Create('button', {
								type: 'button',
								innerHTML: 'Delete Team',
								className: 'remove_button',
								onclick: () => { removeTeam(team_data) }
							})
					)
				]
			})
		]
	});
}

function generateTeamSelectionList() {
	
	Select('#team_list', {
		innerHTML: '',
		children: Object.keys(GLOBAL.active_tournament.data.sets.teams.entries).map(team_uid => {
			let team = GLOBAL.active_tournament.data.sets.teams.entries[team_uid];
			return Create('div', {
				innerHTML: team.display,
				className: 'team_block',
				onclick: () => { loadTeamData(team.uid); },
				style: {
					backgroundColor: team.primary_color,
					color: team.secondary_color
				}
			});
		})
	});
	
}