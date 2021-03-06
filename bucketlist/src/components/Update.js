import React from "react";
// import './modal.css'

let baseURL = process.env.REACT_APP_BASE_URL

class Update extends React.Component {
  state = {
    item: {},
    listName: "",
    listItems: [] 

  };

  resetState = () =>{
    this.setState({
      listName: this.props.item.listName,
      listItems: this.props.item.items
    })
  }

  handleChange = (event)=>{
    this.setState({
      [event.target.name]: event.target.value
    })
    console.log("handle change", event.target.name, event.target.value)
  }

  handleChangeArray = (event)=>{
      const newListItems = [...this.state.listItems]
      newListItems[event.target.name].itemName = event.target.value
    this.setState({
      listItems: newListItems
    })
    console.log("handle change", event.target.name,)
  }

  handleChangeToggle = (event) =>{
    const newListItems = [...this.state.listItems]
     newListItems[event.target.id].isCompleted = !this.state.listItems[event.target.id].isCompleted
    this.setState({
      listItems: newListItems
    })
    console.log("handle change", event.target.name,)

  }


  handleSubmit = (event) =>{
    console.log("form submitted")
    event.preventDefault();
    let fetchURL = baseURL + '/bucketLists/' +this.props.item._id
    fetch(fetchURL, 
      {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          listName:  this.state.listName,
          items: this.state.listItems
        })
    }).then( res => res.json())
    .then(resJson => {
      //add received data to state if needed
      console.log(resJson)
      this.props.getItems()
      //turn off edit model
      this.props.toggleEditClick(false)
    }).catch (error => console.error({'Error': error}))
  }

  addItem = () => {
    const newListItems = [...this.state.listItems]
    newListItems.push(
      {
        itemName: "",
        itemDescription: "",
        itemCategory: "",
        itemImageURL: "",
        isCompleted: false  
      }
    )
      this.setState({
        listItems: newListItems
      })
  }

  removeItem = (index) => {
    console.log(index)
    const newListItems = [...this.state.listItems]
    newListItems.splice(index,1)
    this.setState({
      listItems: newListItems
    })
  }

  onCloseRequest = e => {
    this.props.onCloseRequest && this.props.onCloseRequest(e);
  };

  render() {

    if(!this.props.display){
      return null;
    } else {
      return (
          <div className="modal edit">
            <div className="listItemsShow listItemsEdit">
              <div 
                className="cancelUpdate"
                onClick={() => this.props.toggleEditClick(false)}
              >
                CANCEL
              </div>
              <form onSubmit={this.handleSubmit}>
                
                  <div className="formfields">
                    <label htmlFor="listName">List Name</label>
                    <input 
                      onChange={this.handleChange}
                      type="text"
                      name="listName"
                      value ={this.state.listName}
                    />
                  </div>
                  {this.state.listItems.map((item, index) => 
                    <div className="formfields" key={item.id}>
                      <label htmlFor="List Item">List Item</label>
                      <div onClick={()=>this.removeItem(index)}>
                        <label>remove</label>
                      </div>
                      <div id="checkboxInput">
                        <input 
                          className="completedBox"
                          onChange={this.handleChangeToggle}
                          type="checkbox"
                          id={index}
                          checked={item.isCompleted}
                        />
                        <input 
                          onChange={this.handleChangeArray}
                          type="text"
                          name={index}
                          value ={item.itemName}
                        />
                      </div>
                    </div>
                  )}
                      <div onClick={this.addItem} className="addListItem">
                          ADD NEW ITEM
                      </div>              
                <div className="editList">
                  <input type="submit" value="SAVE CHANGES" />
                </div>
              </form>
            </div>
          </div>
      );
    }
  }

  componentDidMount() {
  //populates form with current values:
  this.resetState()
}

}

export default Update;
