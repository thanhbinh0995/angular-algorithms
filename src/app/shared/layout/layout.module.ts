import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent, TutorialComponent } from "./";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [HeaderComponent, TutorialComponent],
  imports: [CommonModule, RouterModule],
  exports: [HeaderComponent, TutorialComponent]
})
export class LayoutModule {}
