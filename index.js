const axios = require('axios');
require('dotenv').config()
const express = require('express')
var cors = require('cors');
const og_items = require('./og_items');
const { saveCheckoutId, getCheckout } = require('./db');
const app = express()
const port = 8999


app.use(cors())
app.use(express.json());

const token = process.env.ACCESS_TOKEN

const DEFAULT_EXPRESS_OBJ = {
    "reference_id": "REFERÊNCIA DO PRODUTO",

    "customer": {
    //   "name": "João teste",
    //   "email": "joao@teste.com",
    //   "tax_id": "12345678909",
    //   "phone": {
    //     "country": "+55",
    //     "area": "27",
    //     "number": "999999999"
    //   }
    },
    "customer_modifiable": true,
    "items": [],
    "additional_amount": 0,
    "discount_amount": 0,
    "payment_methods": [
      {
        "type": "credit_card",
        "brands": [
          "mastercard"
        ]
      },
      {
        "type": "credit_card",
        "brands": [
          "visa"
        ]
      },
      {
        "type": "debit_card",
        "brands": [
          "visa"
        ]
      },
      {
        "type": "PIX"
      },
      {
        "type": "BOLETO"
      }
    ],
    "payment_methods_configs": [
      {
        "type": "credit_card",
        "config_options": [
          {
            "option": "installments_limit",
            "value": "1"
          }
        ]
      }
    ],
    "soft_descriptor": "xxxx",
    "redirect_url": "https://pagseguro.uol.com.br",
    "return_url": "https://pagseguro.uol.com.br",
    "notification_urls": [
      "https://pagseguro.uol.com.br"
    ]
  }

const config = {
    headers: {
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'accept': '*/*'
    }
};



// método para criar um novo checkout e salva-lo no banco de dados
app.post('/', checkoutRequiredParams, async (req, res) => {
    buildList(req.body.list)
    let response = await axios.post('https://sandbox.api.pagseguro.com/checkouts', DEFAULT_EXPRESS_OBJ, config)
    
    let checkout_id = response.data.id
    console.log(checkout_id);
    
    saveCheckoutId(response.data)

    res.send(response.data.links[1].href)
})

//método que servirá para receber o retorno quando o status do checkout for atualizado
app.post('/checkout_status_update', (req, res)=>{
    let params = req.body
    // if(params.items)
    console.log(req);
  
    res.send(params)
})

//retorna um checkout a partir do ID
app.get('/checkout/:checkoutId', async (req, res)=>{
  let id = req.params.checkoutId
  let response =  await getCheckout(id)
  console.log(req.params);
  
  res.send(response)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

//validar parâmetros do checkout recebido
function checkoutRequiredParams(req, res, next){
    let {list} = req.body
    if(list && list.length > 0){
        next()
    } else {
        res.status(400).json({
            error: true,
            message:'Lista de ingressos obrigatória'
        })
    }
    
}

function buildList(list){
  DEFAULT_EXPRESS_OBJ.items = []
    list.forEach(item=>{
        let og_item = getItem(item.id)
        DEFAULT_EXPRESS_OBJ.items.push({
            reference_id: item.id,
            quantity: item.qtd || 1,
            name: og_item.name,
            unit_amount: og_item.price * 100 ,//em centavos por padrão
            image_url: "https://www.petz.com.br/blog//wp-content/upload/2018/09/tamanho-de-cachorro-pet-1.jpg"
        })
    })
}

function getItem(id){
    
    return og_items[id]
}
  

