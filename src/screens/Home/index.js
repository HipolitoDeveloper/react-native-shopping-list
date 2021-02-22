import React, {Component} from 'react'
import {
    Text,
    View, 
    ImageBackground, 
    
    StyleSheet, 
    TouchableOpacity, 
    Platform,
    Alert,
    FlatList,
    SafeAreaView,
    KeyboardAvoidingView,} from 'react-native'

import {Container, Header, HeaderTitle, HeaderSubTitle} from './style'
import Parse from "parse/react-native.js";

import {Picker} from '@react-native-picker/picker'

import commonStyles from '../../commonStyles'

import moment from 'moment'
import 'moment/locale/pt-br'

import Icon from 'react-native-vector-icons/FontAwesome'
import AutoCompleteInput from '../../components/AutoCompleteInput'
import List from '../../components/List'

import { LinearGradient } from 'expo-linear-gradient';

import dataTeste from '../../dataTeste'



const initialState = {       
    categorias: []   
}



export default class Home extends Component {

    
    state = {        
        ...initialState
     }   

    async componentDidMount() {
        await this.loadShopList();        
    }

    setList(list) {
        this.setState({list: list})

    }

    // loadShopList = async ()  =>  {  
  
    //         try {                       
    //             const ItemUsuario = Parse.Object.extend("itens_usuarios")
    //             const queryItemUsuario = new Parse.Query(ItemUsuario)    
    //             queryItemUsuario.include("item_id")
    //             queryItemUsuario.include(["item_id.categoria_id"])  
    //             queryItemUsuario.ascending("item_id")
    
    //             const itensUsuario = await queryItemUsuario.find();          
    
    //             const Categoria = Parse.Object.extend("categorias")
    //             const queryCategoria = new Parse.Query(Categoria)   
    
    //             let categorias = [];                
    //             for(let i = 0; i < itensUsuario.length; i++) {   
               
    //                 const categoriaId = itensUsuario[i].get("item_id").get("categoria_id").id;              
    //                 queryCategoria.equalTo("objectId",  itensUsuario[i].get("item_id").get("categoria_id").id)
    //                 const categoria = await queryCategoria.find();                      
                  
    //                 const categoriaDuplicada = categorias.find(cat => cat.id == categoriaId)
                    
    //                 if(categoriaDuplicada == undefined) {
    //                     categorias.push(categoria[0])              
    //                 }
    //             }
          
    //             categorias.forEach(c => {      
    //                 c.set("itens", [])
    //                 c.save();        
    //                 itensUsuario.forEach(iu => {
    //                     if(c.id == iu.get("item_id").get("categoria_id").id) {
    //                         c.get("itens").push(iu)
    //                     }
    //                 })    
                   
    //             })                  
           
         
    //             this.setState({categorias: categorias})
          
               
    //         } catch (error) {                
    //             alert(`Não foi possível caregar a Lista de Compras ${JSON.stringify(error.message)}`)
    //         }
         
    // }    

    loadShopList = async ()  =>  {  
  
        try {                       
            const ListaCompraItem = Parse.Object.extend("listas_compras_itens")
            const queryListaCompraItem = new Parse.Query(ListaCompraItem)    
            queryListaCompraItem.include("item_id")
            queryListaCompraItem.include(["item_id.categoria_id"])  
            queryListaCompraItem.ascending("item_id")

            const listasComprasItens = await queryListaCompraItem.find();          

            const Categoria = Parse.Object.extend("categorias")
            const queryCategoria = new Parse.Query(Categoria)   

            let categorias = [];                
            for(let i = 0; i < listasComprasItens.length; i++) {   
           
                const categoriaId = listasComprasItens[i].get("item_id").get("categoria_id").id;              
                queryCategoria.equalTo("objectId",  listasComprasItens[i].get("item_id").get("categoria_id").id)
                const categoria = await queryCategoria.find();                      
              
                const categoriaDuplicada = categorias.find(cat => cat.id == categoriaId)
                
                if(categoriaDuplicada == undefined) {
                    categorias.push(categoria[0])              
                }
            }
      
            categorias.forEach(c => {      
                c.set("itens", [])
                c.save();        
                listasComprasItens.forEach(iu => {
                    if(c.id == iu.get("item_id").get("categoria_id").id) {
                        c.get("itens").push(iu)
                    }
                })    
               
            })                  
       
     
            this.setState({categorias: categorias})
      
           
        } catch (error) {                
            alert(`Não foi possível caregar a Lista de Compras ${JSON.stringify(error.message)}`)
        }
     
}    

    updateShopList = async (item, itemQuantidade)  =>  {  
        //é uma arrow function para ser usado como parametro no click
        try {           
        item.unset("itemQuantidade")
        item.unset("isChose")
        item.save()   
      

        const ListaCompraItem = Parse.Object.extend("listas_compras_itens")
        const listaCompraItem = new ListaCompraItem();

        const Item = Parse.Object.extend("itens")
        const itemCompleto = new Item();
        itemCompleto.id = `${item.id}`      

        listaCompraItem.set("quantidade", itemQuantidade)
        listaCompraItem.set("item_id", itemCompleto)            
        // itemUsuario.set("usuario_id", `${wXSqmG4vwM}`)
        listaCompraItem.save();   

        } catch (error) {
            alert(`Não foi possível atualizar a Lista de Compras ${JSON.stringify(error.message)}`)

        }
    }

    // updateShopList = async (item, itemQuantidade)  =>  {  
    //     //é uma arrow function para ser usado como parametro no click
    //     try {           
    //     item.unset("itemQuantidade")
    //     item.unset("isChose")
    //     item.save()   
      

    //     const ItemUsuario = Parse.Object.extend("itens_usuarios")
    //     const itemUsuario = new ItemUsuario();

    //     const Item = Parse.Object.extend("itens")
    //     const itemCompleto = new Item();
    //     itemCompleto.id = `${item.id}`      

    //     itemUsuario.set("quantidade", itemQuantidade)
    //     itemUsuario.set("item_id", itemCompleto)            
    //     // itemUsuario.set("usuario_id", `${wXSqmG4vwM}`)
    //     itemUsuario.save();   

    //     } catch (error) {
    //         alert(`Não foi possível atualizar a Lista de Compras ${JSON.stringify(error.message)}`)

    //     }
    // }
     
    setQuantityValue = async (itemId, quantity) => {     
        try {
           const ListaCompraItem = Parse.Object.extend("listas_compras_itens")
           const queryListaCompraItem = new Parse.Query(ListaCompraItem)         

           queryListaCompraItem.get(itemId).then((listaCompraItem) => {
            listaCompraItem.set("quantidade", quantity)
            listaCompraItem.save().then((response) => {
                   this.loadShopList();
               });
           })

       } catch (error) {
           alert(`Não foi possível mudar a quantidade do item ${JSON.stringify(error.message)}`)

       }       
   }
//dELETEITEM TODO BUGADO VERIFICAER
   deleteItem = async (itemId) => {
       console.warn('teste')
        try {
            const ListaCompraItem = Parse.Object.extend("listas_compras_itens")
            const queryListaCompraItem = new Parse.Query(ListaCompraItem)         
 
            queryListaCompraItem.get(itemId).then((listaCompraItem) => {           
             listaCompraItem.destroy().then((response) => {
                    this.loadShopList();
                });
            })
        } catch (error) {

        }
   }

    render() {    
    return (
        <Container>     

            <Header style={styles.header}> 
                <LinearGradient 
                    colors={[ '#68CACA', '#fff', ]} 
                    end={{ x: 0.1, y: 0.2 }}
                    style={styles.background} >
                    <HeaderTitle>
                        Bom dia
                    </HeaderTitle>
                    <AutoCompleteInput changeData={this.updateShopList} 
                    refreshListaCompras={this.loadShopList}
                    listaCompraData={this.state.categorias} />
                </LinearGradient>
            </Header>
                
            <List 
            listStyle ={styles.list} 
            data={this.state.categorias} 
            setQuantityValue={this.setQuantityValue}
             />   
                                              
        </Container>
        )
    }   

}

const styles = StyleSheet.create({
    header: {
        flex: 2,     
        // height: 180,       
        backgroundColor: '#FFF',
        // borderColor: 'blue',
        // borderWidth: 10
    },
    list: {
        flex: 5

        // borderColor: 'red',
        // borderWidth: 10
    },
    background: {      
        width: '100%',     
        // position: 'absolute',
        // left: 0,
        // right: 0,
        // top: 0        
      },

})
