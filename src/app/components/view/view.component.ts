import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  subscriptions: Subscription[] = [];
  pokemon: any = null;

  constructor(private route: ActivatedRoute, private pokemonService: PokemonService) { }

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(params => {
      if(this.pokemonService.pokemons.length){
        this.pokemon = this.pokemonService.pokemons.find( poke => poke.name === params.name);
        console.log(this.pokemon);
      }else {
        this.subscription = this.pokemonService.get(params.name).subscribe(response => {
          this.pokemon = response;
          console.log(this.pokemon);
        })
      }
    })
  }

  getEvolution():void {
    this.pokemon.evolution = [];
  }

  getType(pokemon: any): string {
    return this.pokemonService.getType(pokemon);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0)
  }

}
