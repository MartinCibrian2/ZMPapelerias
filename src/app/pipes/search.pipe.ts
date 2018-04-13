import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'search'
})

@Injectable()

export class SearchPipe implements PipeTransform
{
    transform( items: any, term: any ): any {
        let _return: any;

        if( term === undefined ){
            _return    = items;
        } else {
            _return    = items.filter(( item ) => {
                let _exists: any;
                let _word: any;
                Object
                .keys( item )
                .forEach(( _field, _pos ) => {
                    if(( _field.indexOf("_") > -1 && _field.indexOf("_") == 0 ) || typeof( item[ _field ]) === "boolean" ){
                        // This field it is not necessary.
                    } else {
                        _exists    = this.existsWord( term, item[ _field ] );
                        _word      = _word || _exists;
                    }
                })

                return _word;
            });
        }

        return _return;
    }

    existsWord( search: string, stack: any ){
        return ( stack.toLowerCase().indexOf( search.toLowerCase() ) > -1 );
    }
}