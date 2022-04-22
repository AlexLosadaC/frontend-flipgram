import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

import React, { Component } from 'react'

class Search extends Component {
    state = {
        query: '',
    }

    handleInputChange = () => {
        this.setState({
            query: this.search.value
        })
    }

    render() {
        return (
            <form>
                <input
                    placeholder="Search for..."
                    ref={input => this.search = input}
                    onChange={this.handleInputChange}
                />
                <p>{this.state.query}</p>
            </form>
        )
    }
}

export default Search

/*<button type="submit" className="search__button"><SearchIcon /></button>
<InputBase

  placeholder="Search…"
  classes={{
    root: classes.inputRoot,
    input: classes.inputInput,
  }}
  inputProps={{ 'aria-label': 'search' }}
/>*/