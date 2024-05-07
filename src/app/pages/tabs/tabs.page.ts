import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor() {}

  selectedTab: string = 'home';

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  getIcon(tab: string, outline: string, solid: string) {
    return this.selectedTab === tab ? solid : outline;
  }

}
