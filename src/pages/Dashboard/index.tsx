import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Request {
  data: {
    transactions: [Transaction];
    balance: Balance;
  };
}

function getValueInReais(value: number): string {
  return value.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    (async (): Promise<void> => {
      const { data }: Request = await api.get('transactions');

      setTransactions(data.transactions);
      setBalance(data.balance);
    })();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">
              {balance.income ? getValueInReais(balance.income) : 'R$ 0,00'}
            </h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {balance.outcome ? getValueInReais(balance.outcome) : 'R$ 0,00'}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">
              {balance.total ? getValueInReais(balance.total) : 'R$ 0,00'}
            </h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            {transactions.map(transaction => {
              return (
                <tbody>
                  <tr>
                    <td className="title">{transaction.title}</td>
                    {transaction.type === 'income' ? (
                      <td className="income">
                        {getValueInReais(transaction.value)}
                      </td>
                    ) : (
                      <td className="outcome">
                        {`- ${getValueInReais(transaction.value)}`}
                      </td>
                    )}
                    <td>{transaction.category.title}</td>
                    <td>
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
