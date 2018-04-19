import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../styles/styles.scss';
import MultipleValueTextInputItem from './MultipleValueTextInputItem';

const propTypes = {
	/** Any values the input's collection should be prepopulated with. */
	values: PropTypes.arrayOf(PropTypes.string),
	/** Method which should be called when an item is added to the collection */
	onItemAdded: PropTypes.func.isRequired,
	/** Method which should be called when an item is removed from the collection */
	onItemDeleted: PropTypes.func.isRequired,
	/** Label to be attached to the input, if desired */
	label: PropTypes.string,
	/** Name attribute for the input */
	name: PropTypes.string.isRequired,
	/** Placeholder attribute for the input, if desired */
	placeholder: PropTypes.string,
	/** ASCII charcode for the keys which should
	 * trigger an item to be added to the collection (defaults to comma (44) and Enter (13))
	 */
	charCodes: PropTypes.arrayOf(PropTypes.number),
	/** JSX or string which will be used as the control to delete an item from the collection */
	deleteButton: PropTypes.node
};

const defaultProps = {
	placeholder: '',
	charCodes: [13, 44],
	deleteButton: (<span>&times;</span>),
	values: [],
	label: ''
};
/**
 * A text input component for React which maintains and displays a collection
 * of entered values as an array of strings.
 */
class MultipleValueTextInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			values: props.values,
			value: ''
		};
		this.handleKeypress = this.handleKeypress.bind(this);
		this.handleValueChange = this.handleValueChange.bind(this);
		this.handleItemAdd = this.handleItemAdd.bind(this);
		this.handleItemRemove = this.handleItemRemove.bind(this);
	}
	handleKeypress(e) {
		const { onItemAdded, charCodes } = this.props;
		// 13: Enter, 44: Comma
		if (charCodes.includes(e.charCode)) {
			e.preventDefault();
			this.handleItemAdd(e.target.value, onItemAdded);
		}
	}
	handleValueChange(e) {
		this.setState({ value: e.target.value });
	}
	handleItemAdd(value, onItemAdded) {
		if (this.state.values.includes(value) || !value) {
			this.setState({ value: '' });
			return;
		}
		const newValues = this.state.values.concat(value);
		this.setState({
			values: newValues,
			value: ''
		});
		onItemAdded(value, newValues);
	}
	handleItemRemove(value) {
		const currentValues = this.state.values;
		const newValues = currentValues.filter(v => v !== value);
		this.props.onItemDeleted(value, newValues);
		this.setState({ values: newValues });
	}
	render() {
		const {
			placeholder,
			label,
			name,
			deleteButton,
			onItemAdded,
			onItemDeleted,
			...forwardedProps
		} = this.props;
		const values = this.state.values && this.state.values.length
			? this.state.values
			: this.props.values;
		const valueDisplays = values.map(v => (
			<MultipleValueTextInputItem
				value={v}
				key={v}
				deleteButton={deleteButton}
				handleItemRemove={this.handleItemRemove}
			/>));
		return (
			<div className="multiple-value-text-input">
				<label htmlFor={name}>{label}
					<div className="multiple-value-text-input-item-container">
						<p>{valueDisplays}</p>
					</div>
					<input
						name={name}
						placeholder={placeholder}
						value={this.state.value}
						type="text"
						onKeyPress={this.handleKeypress}
						onChange={this.handleValueChange}
						{...forwardedProps}
					/>
				</label>
			</div>
		);
	}
}

MultipleValueTextInput.propTypes = propTypes;
MultipleValueTextInput.defaultProps = defaultProps;
export default MultipleValueTextInput;
