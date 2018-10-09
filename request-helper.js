/*
 * No Comments? it was hard to write, so it should be hard to read!
 * You may think you know what the following code does.
 * But you dont. Trust me.
 * Fiddle with it, and youll spend many  sleepless
 * nights cursing the moment you thought youd be clever
 * enough to "optimize" the code below.
 * Now close this file and go play with something else.
 */

const request = require('request-promise')
const fs = require('fs-extra')
const args = require('yargs').argv

const account = args.ACCOUNT
const password = args.PASSWORD
const dbName = args.DBNAME

const checkParams = (account, password, dbName) => {
    if(account != null && password != null && dbName != null ){
        console.log('ALL REQUIRED PARMS PASSED, TIGHTENING BELTS...');
    }else {
         throw 'REQUIRED PARMS NOT PASSED.'
    }
}
const buildConnections = (forWho) => {
    // I am not sure if we need this, but too scared to delete.
    switch (forWho) {
        case 'indexs':
            return `https://${account}-bluemix:${password}@${account}-bluemix.cloudant.com/${dbName}/_design/app`
        default:
            return `https://${account}-bluemix:${password}@${account}-bluemix.cloudant.com/${dbName}`
    }
}

const createViewsAndIndexes = async (serviceSpecificIndexes) => {
    try {
        //TODO: remove test at the end, after demoing to @Navdeep.
        const indexFile = `${serviceSpecificIndexes}Index.def`

        const readFile = await fs.readFile(indexFile, 'utf8');


        const response = await request.put(buildConnections("indexs"), { body: readFile} )

        console.log('INITIATED INDEX CREATION.');
        console.log('INDEX CREATED SUCCESSFULLY');
        console.log('STEP[3/3]');
        console.log(
            'DONE  ALL          ("`-’-/").___..--’’"`-._\n' +
            'STEPS               `6_ 6  )   `-.  (     ).`-.__.‘)\n' +
            'SUCCESSFULLY.       (_Y_.)’  ._   )  `._ `. ``-..-’\n' +
            '                   _..`--’_..-_/  /--’_.’ ,’\n' +
            '                  (il),-’‘  (li),’  ((!.-‘\n' );
    } catch (error) {
        if(error.statusCode === 409) {
            console.log('CONFLICT! INDEX ALLREADY EXISTS.')
        }else if(error.statusCode === 400){
            console.log(error.message)
        }else{
            console.log(error)
        }
    } finally {
        // should never happen. BLISSSSSSSS
    }
}
//That's me!!!
class Smart {

    static async createDb() {
        try {
            checkParams(account, password, dbName)
            console.info('STARTED AUTOMATING CLOUDANT DB.')
            console.info('RELAX... POPCORN MEANWHILE?.')
            console.info('STEP[1/3]')
            // Create a new "dbName" database .
               const response = await request.put(buildConnections())
                // Magic. Do not touch.
                    switch (dbName) {
                        //TODO: remove test at the end, after demoing to @Navdeep.
                        //Cloudant creation for Save & retervie service.
                        case "saveandretrieve":
                            console.log('DB CREATED SUCCESSFULLY. STEP[2/3]')
                            console.log('INDEX CREATION....')
                            createViewsAndIndexes(dbName)
                            console.log('IN PROGRESS....')
                            break
                        //Cloudant creation for reporting service.
                        case "reporting":
                            console.log('DB CREATED SUCCESSFULLY. STEP[2/3]')
                            console.log('INITIATED VIEWS, INDEX CREATION....')
                            createViewsAndIndexes(dbName)
                            //createViews(dbName)
                            console.log('IN PROGRESS....')
                            break
                        //Cloudant creation for transactionhistory service.
                        case "transactionhistory":
                            console.log('DB CREATED SUCCESSFULLY. STEP[2/3]')
                            console.log('INITIATED VIEWS, INDEX CREATION....')
                            createViewsAndIndexes(dbName)
                            //createViews(dbName)
                            console.log('IN PROGRESS....')
                            break
                        //Cloudant creation for KICK-OUT, RETRY! [ARE YOU SURE?]
                        default:
                            console.log('WAITING FOR STEPS[3/3]?, NAH its DONE.')
                            console.log('WHO-HOOOOOOO, THATS A QUICKER!')
                            console.log('KICK-OUT? RETRY! DB CREATED SUCCESSFULLY *WINK*')
                            console.log(
                                'DB                         ("`-’-/").___..--’’"`-._\n' +
                                'SUCCESSFULLY               `6_ 6  )   `-.  (     ).`-.__.‘)\n' +
                                'CREATED.                   (_Y_.)’  ._   )  `._ `. ``-..-’\n' +
                                '                             _..`--’_..-_/  /--’_.’ ,’\n' +
                                '                           (il),-’‘  (li),’  ((!.-‘\n' );
                    }
        } catch (error) {
            //who cares? simply retry!
            if(error && error.statusCode === 412) {
                console.log(`The database could not be created, the ${dbName} already exists.`)
                } else if (error && error.statusCode === 400) {
                console.log('400 ERROR')
            } else if(error && error.statusCode === 403) {
                console.log('INVALID DATABASE NAME.')
            } else  {
                console.log('SERVICE UNAVAILBLE.')
            }
        } finally {
            //Abandon all hope ye who enter beyond this point
        }
    }

}

module.exports = Smart