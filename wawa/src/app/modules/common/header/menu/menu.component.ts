import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { AuthenticatedUserModel } from '../../../auth/model/authenticated-user.model';
import { Subscription } from 'rxjs';
import { NavbarComponent } from 'ng-uikit-pro-standard';
import { SelectionService } from '../../../interclubs/selections/services/selection.service';
import { InterclubsCategoryModel } from 'src/app/modules/interclubs/selections/model/interclubs-category.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  user: AuthenticatedUserModel = null;
  userEventsSubscription: Subscription;
  interclubCategories: Array<InterclubsCategoryModel>;

  loading = true;
  @ViewChild('navbar', { static: true }) navbar: NavbarComponent;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private selectionService: SelectionService,
  ) { }

  ngOnInit(): void 
  {
    this.userEventsSubscription = this.authService.userEvents.subscribe(user => {
      this.user = user;
    });

    this.selectionService.getInterclubsCategories()
      .subscribe(res=> {
        this.interclubCategories = res;
        console.log('les categories interclubs:', res); 
        this.selectionService.setCategories(res);
      },
      err => console.error('erreur', err)
      ,
      () => this.loading = false
    );
  }

  ngOnDestroy() 
  {
    if (this.userEventsSubscription) this.userEventsSubscription.unsubscribe();
  }

  getLogoImageUrl()
  {
    return './assets/img/Logo_Liwa_2020.jpg';
    //  return './assets/img/Logo_Liwa_2020.jpg';
  }

  onLogoClicked()
  {
    this.navigateHome();
  }
  
  navigateHome()
  {
    this.router.navigate(['']);
  }

  getAuthService(): AuthService
  {
    return this.authService;
  }

  isSaisonActive(): boolean
  {
    console.warn('this method should be deleted !');
    return false;
  }

  onLogin(event) 
  {
    this.router.navigate(['auth', 'login']);
    this.navbar.hide();
  }

  onLogout(event)
  {
    event.preventDefault();
    this.authService.logout();
    this.navigateHome();
    if(this.navbar)  this.navbar.hide();
  }

  onMyProfile(event)
  {
    // this.router.navigate(['myProfile']);
    // TODO
    /*
        Réutiliser ici le formulaire - fiche d'un membre et l'appliquer à l'utilisateur actuellement
        connecté.
    */
  }
}
