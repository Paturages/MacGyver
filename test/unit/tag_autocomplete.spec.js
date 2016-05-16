describe("Mac tag autocomplete", function() {
  var $compile, $rootScope, $timeout, keys;

  function hasClass(element, className) {
    return element[0].className.indexOf(className) > -1;
  }

  beforeEach(module("Mac"));
  beforeEach(module("template/tag_autocomplete.html"));
  beforeEach(module("template/menu.html"));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _keys_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    keys = _keys_;
  }));

  describe("basic initialization", function() {
    it("should be replaced by the template", function() {
      var element;
      element = $compile("<mac-tag-autocomplete></mac-tag-autocomplete>")($rootScope);
      $rootScope.$digest();
      return expect(hasClass(element, "mac-tag-autocomplete")).toBeTruthy();
    });

    it("should set default value and label attribute on mac-autocomplete", function() {
      var element, textInput;
      element = $compile("<mac-tag-autocomplete></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      textInput = element[0].querySelector(".mac-autocomplete");

      expect(textInput.getAttribute("mac-autocomplete-label")).toBe("name");
    });

    it("should set value and label attribute on mac-autocomplete", function() {
      var element, textInput;
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-label='test-name' mac-tag-autocomplete-value='test-id'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      textInput = element[0].querySelector(".mac-autocomplete");

      expect(textInput.getAttribute("mac-autocomplete-label")).toBe("test-name");
    });

    it("should pass empty string as key and value", function() {
      var element, textInput;
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-label='' mac-tag-autocomplete-value=''></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      textInput = element[0].querySelector(".mac-autocomplete");

      expect(textInput.getAttribute("mac-autocomplete-label")).toBe('');
    });

    it("should set query attribute on mac-autocomplete", function() {
      var element, textInput;
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-query='query'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      textInput = element[0].querySelector(".mac-autocomplete");

      expect(textInput.getAttribute("mac-autocomplete-query")).toBe("query");
    });

    it("should set delay attribute on mac-autocomplete", function() {
      var element, textInput;
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-delay='100'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      textInput = element[0].querySelector(".mac-autocomplete");

      expect(textInput.getAttribute("mac-autocomplete-delay")).toBe("100");
    });

    it("should set the source attribute on mac-autocomplete", function() {
      var element, textInput;
      $rootScope.source = ["test", "test1", "test2"];
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-source='source'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      textInput = element[0].querySelector(".mac-autocomplete");

      expect(textInput.getAttribute("mac-autocomplete-source")).toBe("macTagAutocomplete.source");
    });

    it("should have the same source function as the parent scope", function() {
      $rootScope.source = jasmine.createSpy("source");
      var element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-source='source'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      var elementScope = element.isolateScope();
      elementScope.macTagAutocomplete.source();

      expect($rootScope.source).toHaveBeenCalled();
    });

    // Add protractor for this use case
    it("should focus on autocomplete when click on tag autocomplete", function() {
      var element, textInput;
      $rootScope.source = ["test", "test1", "test2"];
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-source='source'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();

      textInput = element[0].querySelector(".mac-autocomplete");
      spyOn(textInput, 'focus');
      element.triggerHandler("click");

      expect(textInput.focus).toHaveBeenCalled();
    });

    it("should model -> view", function() {
      var element, textInput;
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-model='model'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      $rootScope.model = "Here";

      $rootScope.$digest();
      textInput = element[0].querySelector(".mac-autocomplete");

      expect(angular.element(textInput).val()).toBe("Here");
    });
  });

  describe("selected variable", function() {
    it("should have a placeholder", function() {
      $rootScope.selected = [];
      var element = $compile("<mac-tag-autocomplete\n  mac-tag-autocomplete-placeholder = \"'Testing'\"\n  mac-tag-autocomplete-selected='selected'>\n</mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();

      var textInputScope = element.isolateScope();
      expect(textInputScope.macTagAutocomplete.placeholder).toBe("Testing");
    });
  });

  describe("onKeyDown", function() {
    it("should fire keydown callback", function() {
      var element, textInput;
      $rootScope.keydown = jasmine.createSpy("keydown");
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-on-keydown='keydown()'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      textInput = element[0].querySelector(".mac-autocomplete");

      browserTrigger(textInput, "keydown");

      expect($rootScope.keydown).toHaveBeenCalled();
    });

    it("should remove the last tag", function() {
      var element, textInput;
      $rootScope.keydown = jasmine.createSpy('keydown');
      $rootScope.selected = [
        {
          id: "tag1"
        }
      ];
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-selected='selected' mac-tag-autocomplete-on-keydown='keydown()'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      textInput = element[0].querySelector(".mac-autocomplete");

      angular.element(textInput).triggerHandler({
        type: "keydown",
        which: keys.BACKSPACE
      });

      expect($rootScope.selected.length).toBe(0);
    });

    it("should push the text into selected", function() {
      var element, textInput;
      $rootScope.keydown = jasmine.createSpy('keydown')
      $rootScope.selected = [];
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-selected='selected' mac-tag-autocomplete-on-keydown='keydown()' mac-tag-autocomplete-disabled='true'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      textInput = angular.element(element[0].querySelector(".mac-autocomplete"));

      var elementScope = element.isolateScope();
      elementScope.macTagAutocomplete.textInput = "Testing";
      textInput.triggerHandler({
        type: "keydown",
        which: keys.ENTER
      });
      $timeout.flush();

      expect($rootScope.selected.length).toBe(1);
    });
  });

  describe("on select callback", function() {
    it("should fire callback", function() {
      var element, textInput;
      $rootScope.onEnter = jasmine.createSpy('onEnter')
      $rootScope.selected = [];
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-selected='selected' mac-tag-autocomplete-on-enter='onEnter(item)' mac-tag-autocomplete-disabled='true'></mac-tag-autocomplete>")($rootScope);
      $rootScope.$digest();

      textInput = element[0].querySelector(".mac-autocomplete");
      var elementScope = element.isolateScope();
      elementScope.macTagAutocomplete.textInput = "Testing";

      angular.element(textInput).triggerHandler({
        type: "keydown",
        which: keys.ENTER
      });
      $timeout.flush();

      expect($rootScope.onEnter).toHaveBeenCalled();
    });
  });
});
