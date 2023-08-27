import {Bicicleta} from "./bicicleta"
import {Cliente} from "./cliente"
import {Funcionario} from "./funcionario"

class Pedido {
    idPedido:Number
    Cliente: Cliente
    Funcionario: Funcionario
    Bicicleta: Bicicleta
    Valor: number = 0.0
    Tempo: number
    DataPedido: string
    DataDevolucao: string

    //cria o objeto, inicializa os valores quando cria o atributo
    constructor(idPedido: number, Cliente: Cliente, Funcionário: Funcionario, Bicicleta: Bicicleta, Tempo: number, DataPedido: string, DataDevolucao: string) {
        this.idPedido = idPedido;
        this.Cliente = Cliente;
        this.Funcionario = Funcionário;
        this.Bicicleta = Bicicleta;
        this.Tempo = Tempo;
        this.DataPedido = DataPedido;
        this.DataDevolucao = DataDevolucao;
    }

    //métodos (parametro) : retorno
    aluguel (Tempo:number): void {
        this.Valor = this.Valor + (Tempo* this.Bicicleta.valor);
        this.Tempo+=Tempo
    }
    Alterardata(data:string) {
        this.DataDevolucao = data;
    }
}
/*
const roberto = new Funcionario('Roberto Pereira', 1554)
const geAl = new Funcionario('Geovana Alcantara', 1555)
const rafael = new Cliente('Rafael Poddis', '111222333-44', '78996365471')
const bike = new Bicicleta(1452, 740.50)
const pedidoRafael = new Pedido(123, rafael, roberto, bike, 0, 202356, 202356)

pedidoRafael.aluguel(60)
console.log(pedidoRafael)
*/
