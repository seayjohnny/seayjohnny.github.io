
// Constants
const MINIMUM_ITEMS_TO_SHOW = 1;
const MAXIMUM_ITEMS_TO_SHOW = 4;
const CYCLE = true;
const MINIMUM_ITEM_WIDTH_SCALAR = .55;
const SPACING = 20;
const ITEMS = document.getElementsByClassName("item");
const UPDATE_DELAY = .5;

// Variables
var itemWidth = getItemWidth();
var minItemWidth = itemWidth * MINIMUM_ITEM_WIDTH_SCALAR;
var carouselWidth = getCarouselWidth();								
var minimumCarouselWidths = findMinCarouselWidths();
var visibleItemsToShow = MAXIMUM_ITEMS_TO_SHOW;
var currentIndex = 0;

// Initialize Carousel
windowResizeListener();
window.addEventListener('resize', windowResizeListener);
var updateFlag = true;

// Helper functions
function getItemWidth(){
	return ITEMS[0].getBoundingClientRect().width;
}

function getItemHeight(){
	return ITEMS[0].getBoundingClientRect().height;
}

function getCarouselWidth(){
	return document.documentElement
							.getElementsByClassName("custom-carousel")[0]
							.getBoundingClientRect()
							.width;	
}

function getCarouselHeight(){
	return document.documentElement
							.getElementsByClassName("custom-carousel")[0]
							.getBoundingClientRect()
							.height;	
}

function getCarouselLeftPos(){
	return document.documentElement
							.getElementsByClassName("custom-carousel")[0]
							.getBoundingClientRect()
							.left;	
}

// Functions to help position and size items
function findMinCarouselWidths(){
	var minWidths = [];
	for(var i = MINIMUM_ITEMS_TO_SHOW; i <= MAXIMUM_ITEMS_TO_SHOW; i++){
		minWidths.push(((minItemWidth * i) + (SPACING * (i + 1))) + 100);
		//sminWidths.push((minItemWidth + (SPACING * 2))*i - 40);
	}
	return minWidths;
}

function findItemOffsets(){
	var itemOffsets = [];
	var cw = getCarouselWidth();
	var z = (getItemWidth() * visibleItemsToShow) + (SPACING * (visibleItemsToShow + 1));
	for( var i = 0; i < visibleItemsToShow; i++){
		if(i == 0){
			itemOffsets.push((getCarouselWidth() / 2) - (z / 2));
		} else {
			itemOffsets.push(itemOffsets[i-1] + getItemWidth() + SPACING);
		}
		//itemOffsets.push(((i + 1) * (getCarouselWidth() / (visibleItemsToShow + 1))) - (getItemWidth() * 0.5));
	}
	return itemOffsets;
}

function resizeItems(){
	var itemOffsets = findItemOffsets();
	console.log(getCarouselWidth());
	if(itemOffsets.length > MINIMUM_ITEMS_TO_SHOW) {
		var newWidth = (getCarouselWidth() - 100 - (SPACING * (visibleItemsToShow + 1))) / visibleItemsToShow;
	} else {
		var newWidth = minItemWidth;
	}
	if (newWidth > 250){
		newWidth = 250;
	}
	
	if (newWidth < minItemWidth){
		newWidth = minItemWidth;
	}
	for( var i = 0; i < ITEMS.length; i++){
		ITEMS[i].style.width = newWidth + "px";
	}
}

// Functions that handle the changing of items
function getIndex(n, offset) {
	if(n < 0) {
		return n + ITEMS.length;
	} else if(n > ITEMS.length - 1) {
		return n - ITEMS.length;
	} else {
		return n;
	}
}

function prevItem() {
	if(updateFlag){
		if(CYCLE!=true & currentIndex > 0){
			updateCarousel(currentIndex -= 1);
		} else if(CYCLE==true){
			
			updateCarousel(currentIndex -= 1);
		}
		updateFlag = false;
		setUpdateFlagTrueAfterDelay();
	}

}

function nextItem() {
	console.log(updateFlag);
	if(updateFlag){
		if(CYCLE!=true & currentIndex < ITEMS.length - visibleItemsToShow ){
			updateCarousel(currentIndex += 1);
		} else if(CYCLE==true){
			updateCarousel(currentIndex += 1);
		}
		updateFlag = false;
		setUpdateFlagTrueAfterDelay();
	}

	
}

function setUpdateFlagTrueAfterDelay() {
	setTimeout(function () {
		updateFlag = true;
	}, UPDATE_DELAY * 1000);
}

// Function that updates carousel with a given index (n)
function updateCarousel(n) {
	// Get the offsets used for positioning items
	var offsets = findItemOffsets();
	// Find the top position offset so that the items are vertically centered
	var topPos = (getCarouselHeight() / 2) - (getItemHeight() / 2); 
	// Default all items, to calculate new positions
	for( var i = 0; i < ITEMS.length; i++){
		ITEMS[i].className = "item";
		ITEMS[i].style.left = "";
		ITEMS[i].style.top = topPos + "px";
	}
	// Iterate through items to apply class names and position visible items
	for( var i = 0; i < visibleItemsToShow; i++){
		// Set the class name of the item before the first visible item
		// so that it will be placed to the left of the carousel
		// (positioning done in CSS)
		if(i == 0) {
			ITEMS[getIndex(n - 1)].className = "item inactive left";
		}
		// Set the class name of the item after the last visible item
		// so that it will be placed to the right of the carousel
		// (positioning done in CSS)
		if(i == visibleItemsToShow - 1) {
			ITEMS[getIndex(n + i + 1)].className = "item inactive right";
		}
		// Set the class name of visible items and position them using
		// offsets array
		ITEMS[getIndex(n + i)].className = "item active";
		var offset = offsets[i] + 10;
		ITEMS[getIndex(n + i)].style.left = offset + "px";
	}
	
	// Set currentIndex
	currentIndex = getIndex(n);
	
}

// Window resize event listener
function windowResizeListener() {
	for(var i = MINIMUM_ITEMS_TO_SHOW - 1; i < MAXIMUM_ITEMS_TO_SHOW; i++){
		if(getCarouselWidth() > minimumCarouselWidths[i]){
			visibleItemsToShow = i + 1;
		}
		resizeItems();
		updateCarousel(currentIndex);
	}
}