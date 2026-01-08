import { Component, computed, signal } from '@angular/core';
import { BannerComponent } from './banner/banner.component';
import { FormNovaTransacaoComponent } from './form-nova-transacao/form-nova-transacao.component';
import { ExtratoComponent } from './extrato/extrato.component';
import { TipoTransacao, Transacao } from './modelos/transacao';

@Component({
  selector: 'app-root',
  imports: [BannerComponent, FormNovaTransacaoComponent, ExtratoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  transacoes = signal<Transacao[]>([]);

  saldo = computed(() => {
    return this.transacoes().reduce((acc, trasacaoAtual) => {
      switch (trasacaoAtual.tipo) {
        case TipoTransacao.DEPOSITO:
          return acc + trasacaoAtual.valor;

        case TipoTransacao.SAQUE:
          return acc - trasacaoAtual.valor;

        default:
          throw new Error('Tipo de transação não identificado.');
      }
    }, 0);
  });

  processarTransacao(transacao: Transacao) {
    if (
      transacao.tipo === TipoTransacao.SAQUE &&
      transacao.valor > this.saldo()
    ) {
      alert('Saldo insuficiente para realizar o saque.');
      return;
    }
    this.transacoes.update((listaAtual) => [transacao, ...listaAtual]);
  }
}
