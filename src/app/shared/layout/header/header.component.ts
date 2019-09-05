import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener
} from "@angular/core";

@Component({
  selector: "layout-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  @Output() eventEmitter: EventEmitter<null> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  @HostListener("click")
  runBoard() {
    this.eventEmitter.emit();
  }
}
