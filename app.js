import sqlite3  from 'sqlite3';
import { open } from 'sqlite';

//O arquivo data.db é criado a partir dessas linhas de código
async function connectionDB(){
    const db = await open({
        filename: 'data.db',
        driver: sqlite3.Database
    });

    return db;
}

//Todo processo que precise se conectar no banco é feito por aqui.
const banco = await connectionDB();



class Remédio{
    nome;
    descricao;
    bom_efeito;
    colateral_efeito;
    
    constructor(nome, desc, bom, colateral){
        this.nome = nome, this.descricao = desc,
        this.bom_efeito = bom, this.colateral_efeito = colateral;
    }
}

class Gerenciador_remedios{
    static abrir_tabela(){
        banco.exec(`
            create table if not exists remedio(
                nome varchar(20) not null,
                descricao varchar(100) not null,
                bom_efeito varchar(100) not null, 
                colateral_efeito varchar(100)
            )
        `)
    }

    static adicionar(remedio){
        banco.run(
            `insert into remedio(nome, descricao, bom_efeito, colateral_efeito) 
            values(?, ?, ?, ?)`, [remedio.nome, remedio.descricao, remedio.bom_efeito, remedio.colateral_efeito]
        );
    }

    static delete(nome){
        banco.run("delete from remedio where nome = ?", nome)
    }

    static update(antigo, novo){
        
        /* Aqui analisa se o novo valor é ...
            Se sim, o novo valor será o mesmo que o antigo
            Se não, o novo valor será o novo valor */
        novo.nome = (novo.nome == "...") ? antigo.nome : novo.nome;
        novo.descricao = (novo.descricao == "...") ? antigo.descricao : novo.descricao;
        novo.bom_efeito = (novo.bom_efeito == "...") ? antigo.bom_efeito : novo.efeito;
        novo.colateral_efeito = (novo.colateral_efeito == "...") ? antigo.colateral_efeito : novo.colateral_efeito;

        banco.run("update remedio set nome = ?, descricao = ?, bom_efeito = ?, colateral_efeito = ? where nome = ?", [novo.nome, novo.descricao, novo.bom_efeito, novo.colateral_efeito, antigo.nome])
    }

    static list_all(){
        const resp = banco.all(`
            select * from remedio;
        `);

        return resp;
    }

    static list_one(nome){
        const resp = banco.get(`
            select * from remedio where nome = ?;
        `, nome);

        return resp;
    }
}

//Uma lista de remedios temporários (apenas para teste)
const list_remedi = [
    new Remédio("Paratiti", "Curador de dor de cabeça profissa.", "Cura imediatamente a dor.", "Sono imediato de 3 dias."),
    new Remédio("Mangolitio", "Vitamina de Manga. Ideal para quem faz execício físico.", "Fonte de energia potente"),
    new Remédio("LoveBlock", "Para quem sofre com a dor do amor, nossa formula resolve essa dor!", "Acaba com a sofrência em 2 minutos.", "Morte")
]

const diabetes_drugs =
[
    new Remédio("Metformina", "Um dos medicamentos mais usados no tratamento do Diabetes Tipo 2.", "Reduz a glicose do fígado e resistência insulinica", "Náuseas, diarreias, dor abdominal."),
    new Remédio("Acarbose", "Inibe o complexo enzimático", "Retarda a absorção de carboidratos e reduz a glicemia pós-prandial.", "Dor abdominal, diarreias e flatulência"),
    new Remédio("Pioglitazona", "Usada para o controle de hiperglicemia pós-prandial", "Aumentam a secreção de insulina (por um curto período de tempo).", "Ganho de peso, edemas e risco maior de fraturas ósseas"),
    new Remédio("Clorpropamida", "Estimula a secreção pancreática de insulina por ligação", "Impede o fechamento dos canais, evitando hipóxia", "Ganho de peso, queda de pressão e sonolência"),
    new Remédio("Repaglinida", "Usada para o controle de hiperglicemia pós-prandial", "Aumenta a secreção de insulina", "Ganho de peso, edemas e risco maior de fraturas ósseas")
]

Gerenciador_remedios.abrir_tabela();

//Gerenciador_remedios.adicionar(list_remedi[0]);
//Gerenciador_remedios.adicionar(list_remedi[1]);
/*for (let i = 0; i < diabetes_drugs.length; i++)
{
    Gerenciador_remedios.adicionar(diabetes_drugs[i]);
} */
//Gerenciador_remedios.delete("Mangolitio");
//Gerenciador_remedios.adicionar(list_remedi[2]);
const novo_LoveBlock = new Remédio("...", "...", "...", "Dormir pelo resto da vida.");
//Gerenciador_remedios.update(list_remedi[2], novo_LoveBlock);


Gerenciador_remedios.list_all().then(data => console.log(data));
Gerenciador_remedios.list_one("Paratiti").then(data => {console.log(`\nVamos falar de ${data.nome}`); console.log(data)});

