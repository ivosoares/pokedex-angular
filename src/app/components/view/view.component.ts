import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent implements OnInit {
  subscriptions: Subscription[] = [];
  pokemon: any = null;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) {}

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params) => {
      if (this.pokemonService.pokemons.length) {
        this.pokemon = this.pokemonService.pokemons.find(
          (poke) => poke.name === params.name
        );
        debugger;
        if (this.pokemon) {
          this.getEvolution();
          return;
        }
      }

      this.subscription = this.pokemonService
        .get(params.name)
        .subscribe((response) => {
          this.pokemon = response;
          this.getEvolution();
          console.log(this.pokemon);
        });
    });
  }

  getEvolution(): void {
    if(!this.pokemon.evolution || !this.pokemon.evolution.length){
      this.pokemon.evolution = [];
      this.subscription = this.pokemonService
        .getSpecies(this.pokemon.name)
        .subscribe((response: any) => {
          const id = this.getId(response.evolution_chain.url);
          this.subscription = this.pokemonService
            .getEvolution(id)
            .subscribe((response: any) => {
              this.getEvolves(response.chain)
            });
        });
    }
  }

  getEvolves(chain: any) {
    this.pokemon.evolution.push({
      id: this.getId(chain.species.url),
      name: chain.species.name,
    });
    if(chain.evolves_to.length) {
      this.getEvolves(chain.evolves_to[0])
    }
    console.log(this.pokemon);
  }

  getType(pokemon: any): string {
    return this.pokemonService.getType(pokemon);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) =>
      subscription ? subscription.unsubscribe() : 0
    );
  }

  getId(url: string) {
    const splitUrl = url.split('/');
    return splitUrl[splitUrl.length - 2];
  }
}
