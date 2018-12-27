import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  Button,
  TouchableOpacity
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

function BookItem(props) {
  return (
    <View
      style={{
        flexDirection: "row"
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: 200,
          width: "40%"
        }}
      >
        <Image
          style={{ width: "80%", height: "80%" }}
          source={{ uri: props.image }}
        />
      </View>
      <TouchableOpacity onPress={props.onPressStar}>
        <Ionicons name={props.selected ? 'ios-star' : 'ios-star-outline'} size={50} />
      </TouchableOpacity>
    <View>
      <Text>{props.title}</Text>
      <Text>{props.publisher}</Text>
      <Text>{props.pubupdate}</Text>
      <Text>{props.price}</Text>
    </View>
    </View>

      // <Text>{props.title}</Text>
      // <Text>{props.publisher}</Text>
      // <Text>{props.pubupdate}</Text>
      // <Text>{props.price}</Text>      API연동되서 title,publisher등의 정보값을 json형태로 읽어옴
  );
}

export default class App extends Component {
  state={
    key:'javascript',
    bookItems:[],
    selected:{

    }
  }

  fetchBooks(page=1){
    const display = 10;
    const start = display*(page-1)+1;
    var query = this.state.key;
//''가아니고 ``임 네이버APi dociments- 서비스 -api -책 -예시 -호출
//https://openapi.naver.com/v1/search/book.xml?query=%EC%A3%BC%EC%8B%9D&display=10&start=1 안에내용만 바꿔줌 
//header뒤에 네이버APi dociments- 서비스 -api -책 -예시 "X-Naver-Client-Id: {애플리케이션 등록 시 발급받은 client id 값}"
//header뒤에 네이버APi dociments- 서비스 -api -책 -예시 "X-Naver-Client-Secret: {애플리케이션 등록 시 발급받은 client secret 값}"
    return fetch(
      `https://openapi.naver.com/v1/search/book.json?query=${query}
      &display=${display}&start=${start}`,
      
      {
        headers:{
          "X-Naver-Client-Id": "HySc6IT6VtXWsch7ZTti",
          "X-Naver-Client-Secret": "JdfH5gFz5P"
        }
      }
    )
    .then(response => response.json()).then(responseJson => {
      return responseJson.items;
    })
    .catch(error=>{
      console.error(error);
    });
  }
//생명주기. render가 한바퀴돌고나서 fetch. 밑에 Button 안에 내용은 버튼을 누를때 fetch.
componentDidMount(){
  this.fetchBooks().then(items=>{
    this.setState({
      booksItems:items
    });
  });
}


  render(){
    //Using for changeable number
    let bookItemsWithSelected = this.state.bookItems.map((book)=>{
      return{
        ...book,
        selected:this.state.selected[book.isbn]
      }
    });
      return(
        <View style={styles.container}>
          <View style={{flexDirection:"row"}}>
            <TextInput style={{height:40,width:'80%',
            borderColor:'pink', borderWidth:1}} 
            onChangeText={test=>this.setState({key:text})}
            />
            <Button onPress={()=>{
              this.fetchBooks().then(items=>{
                console.log(items);

                this.setState({
                  bookItems:items
                });
              });
            }}
            title = "search"
            color = "#841584"
            />
              </View>
              <FlatList 
              data={bookItemsWithSelected} 
              keyExtractor={(item)=>item.isbn}
              renderItem={({item})=>(

                <BookItem {...item}
                onPress={() => {
                  
                  this.setState({ // state의 변경은 반드시 setState
                    selected: {
                      ...this.state.selected,
                      [item.isbn]: !this.state.selected[item.isbn]
                      // 들어 가는 모습 "03204023 3204" : true 
                    }
                  });
                }} />
            )}
          />
        </View>
      );
    }
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 30
    },
  
    text: {
      color: "black",
      fontSize: 20
    }
  });


// borderColor 테두리칼라, onChangeText = 검색창에 검색시 셋팅된 key값이 검색값으로변경